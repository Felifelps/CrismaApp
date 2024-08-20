import datetime
import time
from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt
from src.models import db


health = Blueprint('health', __name__)
START_TIME = time.time()

@health.route('/')
@jwt_required()
def health_check():
    return jsonify(
        uptime=f"{time.time() - START_TIME:.2f}s",
        is_db_connected=not db.is_closed(), 
    )


@health.route('/verify')
@jwt_required()
def verify_token():
    return jsonify(
        message='This token is valid',
        expires_in=datetime.datetime.fromtimestamp(get_jwt().get('exp'))
    )
