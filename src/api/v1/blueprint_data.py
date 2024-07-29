import io
import csv

from flask import send_file
from flask_jwt_extended import jwt_required

from src.api.v1.blueprint_frequency import get_model_frequency_statistics
from src.utils import model_to_dict, get_model_class_fields, unset_field_name, STATISTIC_FIELDS

def blueprint_data(model, blueprint):
    model_fields = ('id', *tuple(get_model_class_fields(model)))
    model_set_fields = tuple(get_model_class_fields(model,
                                                    set_fields=True,
                                                    not_set_fields=False))
    
    ref_models = {attr: getattr(model, attr).rel_model for attr in model_set_fields}

    columns = list(model_fields)
    for field in model_set_fields:
        field = unset_field_name(field)
        columns += [f'{field[10]}_{s_field}' for s_field in STATISTIC_FIELDS]

    @blueprint.route('/data')
    @jwt_required()
    def data():
        csv_data = io.StringIO()
        writer = csv.writer(csv_data)

        writer.writerow(columns)

        for obj in model.select():
            row = list(model_to_dict(obj).values())
            statistics = get_model_frequency_statistics(obj,
                                                        model_set_fields,
                                                        ref_models)
            for data in statistics.values():
                row += list(data.values())

            writer.writerow(row)

        file = io.BytesIO()
        file.write(csv_data.getvalue().encode(encoding='utf-8'))
        file.seek(0)

        csv_data.close()

        return send_file(
            file,
            mimetype='text/csv',
            download_name=f'{model.__name__.lower()}s.csv'
        )
