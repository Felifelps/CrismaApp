import datetime

from flask import Blueprint

from src.models import Crismando
from src.api.v1.blueprint_crud import blueprint_model_crud
from src.api.v1.blueprint_data import blueprint_data
from src.api.v1.blueprint_frequency import blueprint_frequency

DATE_PATTERN = '%Y-%m-%d'

def check_data_nasc(data):
    data_nasc = data.get('data_nasc')
    if data_nasc is None:
        return True, None
    try:
        datetime.datetime.strptime(
            data_nasc, DATE_PATTERN
        )
        return True, None
    except ValueError:
        return False, f'Date must be in this pattern: {DATE_PATTERN}'

crismandos = Blueprint('crismandos', __name__)

blueprint_model_crud(
    Crismando,
    crismandos,
    validations=[check_data_nasc],
    field_formatters={
        'data_nasc': lambda data_nasc: datetime.datetime.strptime(data_nasc, DATE_PATTERN).date()
    }
)

blueprint_frequency(Crismando, crismandos)

blueprint_data(Crismando, crismandos)
