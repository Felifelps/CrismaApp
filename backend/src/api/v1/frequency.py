from flask import Blueprint, request, jsonify
from src.models import Crismando, FrequenciaDomingo, FrequenciaEncontro, Encontro, Domingo


frequency = Blueprint('frequency', __name__)

@frequency.route('/', methods=['POST'])
def get_frequency():
    search = request.get_json().get('search')
    if not search:
        return jsonify(error='Missing search'), 400

    for crismando in Crismando.select():
        if crismando.nome.lower() == search.lower():
            encontros = [{
                'justificado': f.justificado,
                'data': f.encontro.data,
                'tema': f.encontro.tema,
                'id': f.id
            } for f in FrequenciaEncontro.filter(crismando=crismando)]

            encontros.sort(key=lambda x: x['data'])

            domingos = [{
                'justificado': f.justificado,
                'data': f.domingo.data,
                'id': f.id
            } for f in FrequenciaDomingo.filter(crismando=crismando)]

            domingos.sort(key=lambda x: x['data'])

            return {
                'frequenciaencontro': encontros,
                'frequenciadomingo': domingos
            }
    
    return jsonify(message='Name not found'), 404
    
