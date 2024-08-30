import getpass
import secrets

from bcrypt import hashpw, gensalt

from src.models import User

def hash_password(password):
    bytes_hashed_pw = hashpw(password.encode(), gensalt())
    return str(bytes_hashed_pw)[2:-1]

username = input('Username: ')
password = hash_password(getpass.getpass())

# For .env
secret_key = secrets.token_hex(64)

with open('.env', 'w', encoding='utf-8') as file:
    file.write((
        f"PASSWORD={password}\n"
        f"SECRET_KEY={secret_key}\n"
    ))

# For api
try:
    User.create(
        username=username,
        email='anonymous@email.com',
        password=password
    )
    print('User and .env generated succesfully')
except Exception as e:
    print(e)
