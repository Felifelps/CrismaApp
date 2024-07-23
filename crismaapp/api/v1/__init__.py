from flask import Blueprint

v1 = Blueprint('v1', __name__)

from .crismandos import crismandos

v1.register_blueprint(crismandos, url_prefix='/crismandos')
