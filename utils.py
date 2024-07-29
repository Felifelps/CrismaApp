import os

from bcrypt import checkpw
from dotenv import load_dotenv
from peewee import FieldAccessor

load_dotenv()

SECRET_KEY = os.environ.get('SECRET_KEY')

ONLINE_DB = int(os.environ.get('ONLINE_DB', 0))

if ONLINE_DB:
    DATABASE_PASSWORD = os.environ.get('DATABASE_PASSWORD')
    DATABASE_USER = os.environ.get('DATABASE_USER')
    DATABASE_HOST = os.environ.get('DATABASE_HOST')
    DATABASE_PORT = os.environ.get('DATABASE_PORT')
    DATABASE_NAME = os.environ.get('DATABASE_NAME')

def check_admin_password(password: str) -> bool:
    """Check if the given password matches the admin password."""
    return checkpw(
        bytes(password, encoding='utf-8'),
        bytes(os.environ.get('PASSWORD'), encoding='utf-8')
    )

def model_to_dict(model):
    return model.__dict__['__data__']

def get_model_class_fields(model_class, set_fields=False, not_set_fields=True):
    for attr, attr_obj in model_class.__dict__.items():
        if not_set_fields and isinstance(attr_obj, FieldAccessor) and attr != 'id':
            yield attr
        if set_fields and '_set' in attr:
            yield attr
