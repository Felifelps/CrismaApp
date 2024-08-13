from flask import Blueprint, request, jsonify
from src.models import Crismando, FrequenciaDomingo, FrequenciaEncontro
from src.utils import model_to_dict


frequency = Blueprint('frequency', __name__)

@frequency.route('/', methods=['POST'])
def get_frequency():
    search = request.get_json().get('search')
    if not search:
        return jsonify(error='Missing search'), 400

    for crismando in Crismando.select():
        if crismando.nome.lower() == search.lower():
            return {
                'frequenciaencontro': {f.id: model_to_dict(f) for f in FrequenciaEncontro.filter(crismando=crismando)},
                'frequenciadomingo': {f.id: model_to_dict(f) for f in FrequenciaDomingo.filter(crismando=crismando)},
            }
    
    return jsonify(message='Name not found'), 404
    
