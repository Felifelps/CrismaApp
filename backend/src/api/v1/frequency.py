from flask import Blueprint, request, jsonify
from src.models import Crismando, FrequenciaDomingo, FrequenciaEncontro, Encontro, Domingo


frequency = Blueprint('frequency', __name__)

@frequency.route('/', methods=['POST'])
def get_frequency():
    search = request.get_json().get('search')
    if not search:
        return jsonify(error='Missing search'), 400

    search = search.strip().lower()

    for crismando in Crismando.select():
        if crismando.nome.lower() == search:
            not_missed_enc = {f.encontro.id: f.justificado for f in FrequenciaEncontro.filter(crismando=crismando)}

            encontros = [
                {
                    'missed': enc.id not in not_missed_enc,
                    'justified': not_missed_enc.get(enc.id, False),
                    'tema': enc.tema,
                    'data': enc.data
                } for enc in Encontro.select()
            ]

            encontros.sort(key=lambda x: x.get('data'))

            not_missed_dom = {f.domingo.id: f.justificado for f in FrequenciaDomingo.filter(crismando=crismando)}

            domingos = [
                {
                    'missed': dom.id not in not_missed_dom,
                    'justified': not_missed_dom.get(dom.id, False),
                    'data': dom.data
                } for dom in Domingo.select()
            ]

            domingos.sort(key=lambda x: x.get('data'))

            return {
                'frequenciaencontro': encontros,
                'frequenciadomingo': domingos
            }
    
    return jsonify(message='Name not found'), 404
    
