from flask import request, render_template, redirect, session, flash, Blueprint

from utils import check_admin_password

auth = Blueprint('auth', __name__)

@auth.route('/login', methods=['POST', 'GET'])
def login():
    if request.method == 'POST':
        password = request.form['password']

        if check_admin_password(password):
            session['logged'] = True
            return redirect('/crismandos')

        flash('Senha inválida')
    return render_template('login.html')


@auth.route('/logout')
def logout():
    session['logged'] = False
    return redirect('/')

@auth.errorhandler(404)
def not_found(_):
    flash('Essa página não existe')
    return redirect('/')
