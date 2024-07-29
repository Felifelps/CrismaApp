import datetime
from flask import Blueprint

from models import Encontro
from crismaapp.api.v1.blueprint_crud import blueprint_model_crud
from crismaapp.api.v1.blueprint_frequency import blueprint_frequency
from crismaapp.api.utils import DATE_PATTERN

def check_data(data):
    data_attr = data.get('data')
    if not data_attr:
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

blueprint_frequency(
    Encontro,
    encontros
)
