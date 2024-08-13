from flask import Blueprint

v1 = Blueprint('v1', __name__)

from .auth import auth
from .crismandos import crismandos
from .domingos import domingos
from .encontros import encontros
from .frequency import frequency

v1.register_blueprint(auth, url_prefix='/auth')
v1.register_blueprint(crismandos, url_prefix='/crismandos')
v1.register_blueprint(domingos, url_prefix='/domingos')
v1.register_blueprint(encontros, url_prefix='/encontros')
v1.register_blueprint(frequency, url_prefix='/frequency')
