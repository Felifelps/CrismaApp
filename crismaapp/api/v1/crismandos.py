import datetime
from flask import Blueprint, request, jsonify

from models import Crismando
from crismaapp.api.utils import check_data_fields
from utils import model_to_dict

crismandos = Blueprint('crismandos', __name__)

CRISMANDO_FIELDS = ['nome', 'telefone', 'data_nasc']
DATE_PATTERN = '%Y-%m-%d'

@crismandos.route('/', methods=['GET', 'POST'])
def list_and_create():
    # GET = list
    if request.method == 'GET':
        return jsonify(
            {crismando.id: model_to_dict(crismando) for crismando in Crismando.select()}
        )
    # POST = create
    result = check_data_fields(request, CRISMANDO_FIELDS)
    if not result[0]:
        return jsonify(
            message=f'Missing {result[1]}'
        ), 400

    data = result[1]

    try:
        datetime.datetime.strptime(data['data_nasc'], DATE_PATTERN)
    except ValueError:
        return jsonify(
            message=f'Date must be in this pattern: {DATE_PATTERN}'
        ), 400

    Crismando.create(
        **data
    )
    return jsonify(message='Created successfully!'), 201

@crismandos.route('/<int:crismando_id>', methods=['GET', 'PUT', 'DELETE'])
def get_edit_delete(crismando_id):
    crismando = Crismando.get_or_none(id=crismando_id)
    if not crismando:
        return jsonify(message='Id not found'), 404
    
    # GET = Retrieve
    if request.method == 'GET':
        return jsonify(**model_to_dict(crismando))

    # PUT = Update
    if request.method == 'PUT':
        data = request.get_json()
        for field in CRISMANDO_FIELDS:
            value = data.get(field)
            if value is not None:
                setattr(crismando, field, value)
        crismando.save()
        return jsonify(
            message='Edited succesfully!',
            **model_to_dict(crismando)
        )
    
    if request.method == 'DELETE':
        crismando.delete_instance()
        return jsonify(
            message='Deleted successfully!'
        )
    # DELETE = delete
