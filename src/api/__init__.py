from flask import Blueprint

api = Blueprint('api', __name__)

from .v1 import v1

api.register_blueprint(v1, url_prefix='/v1')
