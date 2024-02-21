import datetime

from flask import Flask, request, render_template, redirect, session, flash

from .models import Crismando, Encontro, FrequenciaEncontro, Domingo, FrequenciaDomingo
from .utils import check_admin_password, SECRET_KEY

import secrets 

app = Flask('Crisma')
app.secret_key = SECRET_KEY

@app.route('/login', methods=['POST', 'GET'])
def login():
    session['logged'] = False
    if request.method == 'POST':
        password = request.form['password']

        if check_admin_password(password):
            session['logged'] = True
            return redirect('/')
        
        flash('Senha inválida')

    return render_template('login.html')

@app.route('/')
def mainpage():
    if not session.get('logged'):
        return redirect('/login')
    data = {}
    total_encontros = len(Encontro.select())
    total_domingos = len(Domingo.select())
    for crismando in sorted(Crismando.select(), key=lambda crismando: crismando.nome):
        e = FrequenciaEncontro.filter(crismando=crismando)
        d = FrequenciaDomingo.filter(crismando=crismando)
        data[crismando] = {
            "encontros": e,
            "domingos": d,
            "faltas_encontros": total_encontros - len(e),
            "faltas_domingos": total_domingos - len(d)
        }
    return render_template(
        'mainpage.html',
        data=data
    )


@app.route('/crismando/novo', methods=['POST', 'GET'])
def registrar_crismando():
    if not session.get('logged'):
        return redirect('/login')
    if request.method == 'POST':
        data = request.form.to_dict()

        data_nasc = datetime.datetime.strptime(
            data.get('data'),
            '%Y-%m-%d'
        ).strftime('%d/%m/%y')

        Crismando.create(
            nome=data.get('nome'),
            data_nasc=data_nasc,
            telefone=str(data.get('tel'))
        )

        return redirect('/')

    return render_template('registrar_crismando.html')


@app.route('/crismando/del/<int:id>')
def deletar_crismando(id):
    if not session.get('logged'):
        return redirect('/login')
    try:
        crismando = Crismando.get_by_id(id)
        for f in FrequenciaEncontro.filter(crismando=crismando):
            f.delete_instance()
        for f in FrequenciaDomingo.filter(crismando=crismando):
            f.delete_instance()
        crismando.delete_instance()
    except:
        pass
    
    return redirect('/')


@app.route('/encontros')
def encontros():
    if not session.get('logged'):
        return redirect('/login')
    data = {}
    for encontro in Encontro.select():
        data[encontro] = FrequenciaEncontro.filter(encontro=encontro)
    return render_template(
        'encontros.html',
        data=data
    )


@app.route('/encontro/novo', methods=['POST', 'GET'])
def registrar_encontro():
    if not session.get('logged'):
        return redirect('/login')
    if request.method == 'POST':
        data = request.form.to_dict()

        encontro = Encontro.create(
            tema=data.get('tema'),
            data=datetime.datetime.strptime(
                data.get('data'),
                '%Y-%m-%d'
            ).strftime('%d/%m/%y')
        )

        crismandos = request.form.getlist('crismandos[]')

        for crismando_id in crismandos:
            FrequenciaEncontro.create(
                crismando=Crismando.get_by_id(int(crismando_id)),
                encontro=encontro
            )

        return redirect('/encontros')

    return render_template(
        'registrar_encontro.html',
        crismandos=list(sorted(Crismando.select(), key=lambda crismando: crismando.nome))
    )


@app.route('/encontro/del/<int:id>')
def deletar_encontro(id):
    if not session.get('logged'):
        return redirect('/login')
    try:
        encontro = Encontro.get_by_id(id)
        for f in FrequenciaEncontro.filter(encontro=encontro):
            f.delete_instance()
        encontro.delete_instance()
    finally:
        return redirect('/encontros')
    


@app.route('/domingos')
def domingos():
    data = {}
    for domingo in Domingo.select():
        data[domingo] = FrequenciaDomingo.filter(domingo=domingo)
    return render_template(
        'domingos.html',
        data=data
    )


@app.route('/domingo/novo', methods=['POST', 'GET'])
def registrar_domingo():
    if not session.get('logged'):
        return redirect('/login')
    if request.method == 'POST':
        data = request.form.to_dict()

        domingo = Domingo.create(
            data=datetime.datetime.strptime(
                data.get('data'),
                '%Y-%m-%d'
            ).strftime('%d/%m/%y')
        )

        crismandos = request.form.getlist('crismandos[]')

        for crismando_id in crismandos:
            FrequenciaDomingo.create(
                crismando=Crismando.get_by_id(int(crismando_id)),
                domingo=domingo
            )

        return redirect('/domingos')

    return render_template(
        'registrar_domingo.html',
        crismandos=list(sorted(Crismando.select(), key=lambda crismando: crismando.nome))
    )


@app.route('/domingo/del/<int:id>')
def deletar_domingo(id):
    if not session.get('logged'):
        return redirect('/login')
    try:
        domingo = Domingo.get_by_id(id)
        for f in FrequenciaDomingo.filter(domingo=domingo):
            f.delete_instance()
        domingo.delete_instance()
    finally:
        return redirect('/domingos')

@app.errorhandler(Exception)
def error(error):
    return error, 500