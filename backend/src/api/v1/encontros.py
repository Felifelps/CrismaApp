import datetime
from flask import Blueprint

from src.models import Encontro
from src.api.v1.blueprint_crud import blueprint_model_crud
from src.api.v1.blueprint_frequency import blueprint_frequency
from src.api.v1.blueprint_data import blueprint_data
from src.api.utils import DATE_PATTERN

def check_data(data):
    data_attr = data.get('data')
    if data_attr is None:
        return True, None
    try:
        datetime.datetime.strptime(
            data_attr, DATE_PATTERN
        )
        return True, None
    except ValueError:
        return False, f'Date must be in this pattern: {DATE_PATTERN}'

encontros = Blueprint('encontros', __name__)

blueprint_model_crud(
    Encontro,
    encontros,
    validations=[check_data],
    field_formatters={
        'data': lambda data: datetime.datetime.strptime(data, DATE_PATTERN).date()
    }
)

blueprint_frequency(Encontro, encontros)

blueprint_data(Encontro, encontros)
