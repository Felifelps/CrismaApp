import os

from bcrypt import checkpw
from dotenv import load_dotenv

load_dotenv()

SECRET_KEY = os.environ.get('SECRET_KEY')

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
