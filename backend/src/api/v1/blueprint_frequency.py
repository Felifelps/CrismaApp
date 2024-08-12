from flask import request, jsonify
from flask_jwt_extended import jwt_required
from peewee import Model

from src.api.utils import check_data_fields
from src.utils import model_to_dict, get_model_class_fields, create_obj_from_dict, unset_field_name

def blueprint_frequency(model, blueprint):
    model_fields = tuple(get_model_class_fields(
        model,
        set_fields=True,
        not_set_fields=False
    ))

    ref_models = {attr: getattr(model, attr).rel_model for attr in model_fields}
    obj_reference_names = {attr: getattr(model, attr).field.name for attr in model_fields}

    @blueprint.route('/<int:pk>/freq', methods=['GET', 'PUT', 'PATCH'])
    @jwt_required()
    def get_update_frequency(pk):
        obj = model.get_or_none(id=pk)
        if not obj:
            return jsonify(message='Id not found'), 404

        if request.method == 'GET':
            try:
                data = {}
                for attr in model_fields:
                    data[unset_field_name(attr)] = {frequency.id: model_to_dict(frequency) for frequency in getattr(obj, attr)}
                return jsonify(
                    **data
                )
            except Exception as e:
                return jsonify(
                    message=f'An error ocurred: {e}'
                ), 500
        
        if request.method in ['PUT', 'PATCH']:
            result, data = check_data_fields(
                request,
                (unset_field_name(field) for field in model_fields)
            )

            if not result:
                return jsonify(
                    message=f'Missing {data}'
                ), 400

            for field, value in data.items():
                field = f"{field}_set"
                if field not in ref_models:
                    return jsonify(error=f'Invalid field: {field[:-4]}'), 400

                for freq_obj in getattr(obj, field, []):
                    freq_obj.delete_instance()

                for obj_data in value:
                    result = create_obj_from_dict(ref_models[field],
                                                  obj_data)
                    if not result[0]:
                        return jsonify(
                            error=f'An error ocurred: {result[1]}'
                        )

            return jsonify(message='Frequency updated succesfully!')

    @blueprint.route('/<int:pk>/stats')
    @jwt_required()
    def stats(pk):
        obj = model.get_or_none(id=pk)
        if not obj:
            return jsonify(message='Id not found'), 404

        return get_model_frequency_statistics(
            obj,
            model_fields,
            ref_models
        )


def get_model_frequency_statistics(obj, model_set_fields, ref_models):
    data = {}
    for field in model_set_fields:
        attrs = get_model_class_fields(ref_models[field])
        frequency = getattr(obj, field)
        total = 0
        # Getting the related model count
        if len(frequency):
            first = frequency[0]
            ref_attr_list = (attr for attr in attrs if isinstance(getattr(first, attr), Model) and getattr(first, attr) != obj)
            ref_attr_name = tuple(ref_attr_list)[0]
            total = len(getattr(first, ref_attr_name).select())

        participated = len(tuple(filter(lambda x: not x.justificado, frequency)))
        justified = len(tuple(filter(lambda x: x.justificado, frequency)))
        missed = total - (participated + justified)

        data[unset_field_name(field)] = {
            'participated': participated,
            'justified': justified,
            'missed': missed,
            'total': total,
            'participation_rate': round(participated/total * 100, 2) if total else 0,
            'miss_rate': round(missed/total * 100, 2) if total else 0,
            'justify_rate': round(justified/total * 100, 2) if total else 0,
        }

    return data