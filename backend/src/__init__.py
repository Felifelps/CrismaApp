from flask import Flask, session, redirect
from flask_jwt_extended import JWTManager
from flask_cors import CORS

from src.models import db
from src.utils import SECRET_KEY

app = Flask(__name__)
app.secret_key = SECRET_KEY

CORS(app, resources={r"/*": {"origins": "*"}})
JWTManager(app)

from .crismandos import crismandos
from .domingos import domingos
from .encontros import encontros
from .frequency import frequency
from .auth import auth
from .api import api

app.register_blueprint(crismandos, url_prefix='/crismandos')
app.register_blueprint(encontros, url_prefix='/encontros')
app.register_blueprint(domingos, url_prefix='/domingos')
app.register_blueprint(frequency, url_prefix='/frequency')
app.register_blueprint(auth, url_prefix='/auth')
app.register_blueprint(api, url_prefix='/api')

@app.before_request
def before_request():
    db.connect()


@app.after_request
def after_request(response):
    db.close()
    return response


@app.route('/')
def main():
    if session.get('logged'):
        return redirect('/crismandos')
    return redirect('/frequency')
