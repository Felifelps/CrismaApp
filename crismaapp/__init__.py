from flask import Flask, session, redirect
from utils import SECRET_KEY

app = Flask('Crisma')
app.secret_key = SECRET_KEY

from .crismandos import crismandos
from .domingos import domingos
from .encontros import encontros
from .frequency import frequency
from .auth import auth

app.register_blueprint(crismandos, url_prefix='/crismandos')
app.register_blueprint(encontros, url_prefix='/encontros')
app.register_blueprint(domingos, url_prefix='/domingos')
app.register_blueprint(frequency, url_prefix='/frequency')
app.register_blueprint(auth, url_prefix='/auth')

@app.route('/')
def main():
    if session.get('logged'):
        return redirect('/crismandos')
    return redirect('/frequency')
