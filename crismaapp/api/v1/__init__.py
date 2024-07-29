from flask import Blueprint

v1 = Blueprint('v1', __name__)

from .crismandos import crismandos
from .encontros import encontros
from .domingos import domingos

v1.register_blueprint(crismandos, url_prefix='/crismandos')
v1.register_blueprint(encontros, url_prefix='/encontros')
v1.register_blueprint(domingos, url_prefix='/domingos')
