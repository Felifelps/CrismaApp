from flask import request, jsonify
from flask_jwt_extended import jwt_required

from src.api.utils import check_data_fields
from src.utils import model_to_dict, get_model_class_fields

def blueprint_model_crud(model, blueprint, validations=[], field_formatters={}):
    # Receive data
    # Must return a boolean with the validation return and a message for when its False
    model_fields = tuple(get_model_class_fields(model))

    @blueprint.route('/', methods=['GET', 'POST'])
    @jwt_required()
    def list_and_create():
        # GET = list
        if request.method == 'GET':
            return jsonify(
                {obj.id: model_to_dict(obj) for obj in model.select()}
            )
        # POST = create
        result, data = check_data_fields(request, model_fields)

        if not result:
            return jsonify(
                message=f'Missing {data}'
            ), 400

        for validation in validations:
            is_valid, message = validation(data)
            if not is_valid:
                return jsonify(message=message), 400
        
        for attr, formatter in field_formatters.items():
            data[attr] = formatter(data[attr])

        model.create(
            **data
        )
        return jsonify(message='Created successfully!'), 201
    
    @blueprint.route('/<int:pk>', methods=['GET', 'PUT', 'DELETE'])
    @jwt_required()
    def get_edit_delete(pk):
        obj = model.get_or_none(id=pk)
        if not obj:
            return jsonify(message='Id not found'), 404
        
        # GET = Retrieve
        if request.method == 'GET':
            return jsonify(**model_to_dict(obj))

        # PUT = Update
        if request.method == 'PUT':
            data = request.get_json()

            for validation in validations:
                is_valid, message = validation(data)
                if not is_valid:
                    return jsonify(message=message), 400

            for field in model_fields:
                value = data.get(field)
                if value is not None:
                    formatter = field_formatters.get(field)
                    setattr(
                        obj,
                        field,
                        formatter(value) if formatter else value
                    )

            obj.save()
            return jsonify(
                message='Edited succesfully!',
                **model_to_dict(obj)
            )
        
        # DELETE = delete
        if request.method == 'DELETE':
            obj.delete_instance()
            return jsonify(
                message='Deleted successfully!'
            )
