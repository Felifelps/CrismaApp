from flask import request, jsonify
from peewee import IntegrityError

from crismaapp.api.utils import check_data_fields
from utils import model_to_dict, get_model_class_fields

def blueprint_frequency(model, blueprint, validations=[], field_formatters={}):
    # Receive data
    # Must return a boolean with the validation return and a message for when its False
    model_fields = tuple(get_model_class_fields(
        model,
        set_fields=True,
        not_set_fields=False
    ))

    ref_models = {attr: getattr(model, attr).rel_model for attr in model_fields}
    obj_reference_names = {attr: getattr(model, attr).field.name for attr in model_fields}

    @blueprint.route('/<int:pk>/frequency', methods=['GET', 'PUT', 'PATCH'])
    def get_update_frequency(pk):
        obj = model.get_or_none(id=pk)
        if not obj:
            return jsonify(message='Id not found'), 404

        if request.method == 'GET':
            try:
                data = {}
                for attr in model_fields:
                    data[attr.replace('_set', '')] = [model_to_dict(frequency) for frequency in getattr(obj, attr)]
                return jsonify(
                    **data
                )
            except Exception as e:
                return jsonify(
                    error=f'An error ocurred: {e}'
                ), 500
        
        if request.method in ['PUT', 'PATCH']:
            result = check_data_fields(
                request,
                (field.replace('_set', '') for field in model_fields)
            )

            if not result[0]:
                return jsonify(
                    message=f'Missing {result[1]}'
                ), 400

            data = result[1]

            for field, value in data.items():
                field = f"{field}_set"
                ref_model = ref_models[field]

                ref_name = obj_reference_names[field]

                ref_model.delete().where(
                    getattr(ref_model, ref_name)==obj
                ).execute()

                for obj_data in value:
                    result = create_obj_from_dict(ref_model,
                                                  obj_data)
                    if not result[0]:
                        return jsonify(
                            error=f'An error ocurred: {result[1]}'
                        )

            return jsonify(message='Opa')


    def create_obj_from_dict(model, data):
        try:
            obj = model.create(**data)
            return True, obj
        except IntegrityError:
            fields = tuple(get_model_class_fields(model))
            return False, f'Missing one field of {fields}'
        except Exception as e:
            return False, e
        
                

    