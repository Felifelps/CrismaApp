import datetime

from bcrypt import hashpw, gensalt
from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required

from src.models import User
from src.utils import model_to_dict

auth = Blueprint('auth', __name__)

LOGIN_FIELDS = ('username', 'password')
REGISTER_FIELDS = LOGIN_FIELDS + ('email',)

@auth.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    for field in LOGIN_FIELDS:
        if not data.get(field):
            return jsonify(
                msg=f'Missing {field}'
            ), 400

    user = User.get_or_none(
        username=data.get('username')
    )

    if not user:
        return jsonify(msg='User not found'), 404

    if not user.check_password(data.get('password')):
        return jsonify(msg='Invalid credentials'), 403

    return jsonify(
        msg='User logged succesfully!',
        token=create_access_token(
            user.username,
            expires_delta=datetime.timedelta(days=1)
        ),
        username=user.username
    )

@auth.route('/register', methods=['POST'])
@jwt_required()
def register():
    result, user = admin_required()
    if not result:
        return jsonify(
            msg='Unauthorized'
        ), 403

    data = request.get_json()
    for field in REGISTER_FIELDS:
        if not data.get(field):
            return jsonify(
                msg=f'Missing {field}'
            ), 400

    username = data.get('username')
    if User.get_or_none(username=username):
        return jsonify(
            msg='This username is already in use'
        ), 400

    User.create(
        username=username,
        email=data.get('email'),
        password=hashpw(
            data.get('password').encode(encoding='utf-8'),
            gensalt()
        )
    )

    return jsonify(
        msg='User created succesfully!'
    ), 201

@auth.route('/users')
@jwt_required()
def users():
    result, _ = admin_required()
    if not result:
        return jsonify(
            msg='Unauthorized'
        ), 403

    return jsonify(
        users=[model_to_dict(user) for user in User.select()]
    )

def admin_required():
    user = User.get_or_none(
        username=get_jwt_identity()
    )
    if not user or not user.is_admin:
        return False, None
    return True, user
