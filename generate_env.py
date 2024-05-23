import getpass
import secrets

from bcrypt import hashpw, gensalt

bytes_pw = getpass.getpass().encode()
bytes_hashed_pw = hashpw(bytes_pw, gensalt())
str_hashed_pw = str(bytes_hashed_pw)[2:-1]

secret_key = secrets.token_hex(64)

text = f"""
PASSWORD={str_hashed_pw}
SECRET_KEY={secret_key}
"""

with open('.env', 'w', encoding='utf-8') as file:
    file.write(text)

print('.env generated succesfully')
