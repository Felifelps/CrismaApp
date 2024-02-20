import datetime
import os
import time
import threading

from flask import Flask, request, render_template, redirect

from .models import Crismando, Encontro, FrequenciaEncontro, Domingo, FrequenciaDomingo


app = Flask('Crisma')

@app.route('/')
def mainpage():
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
    try:
        crismando = Crismando.get_by_id(id)
        for f in FrequenciaEncontro.filter(crismando=crismando):
            f.delete_instance()
        for f in FrequenciaDomingo.filter(crismando=crismando):
            f.delete_instance()
        crismando.delete_instance()
    finally:
        return redirect('/')


@app.route('/encontros')
def encontros():
    data = {}
    for encontro in Encontro.select():
        data[encontro] = FrequenciaEncontro.filter(encontro=encontro)
    return render_template(
        'encontros.html',
        data=data
    )


@app.route('/encontro/novo', methods=['POST', 'GET'])
def registrar_encontro():

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
    try:
        domingo = Domingo.get_by_id(id)
        for f in FrequenciaDomingo.filter(domingo=domingo):
            f.delete_instance()
        domingo.delete_instance()
    finally:
        return redirect('/domingos')


@app.route('/sair')
def sair():
    threading.Thread(
        target=lambda: time.sleep(3) == os.system('taskkill /F /T /IM app.exe')
    ).start()
    return 'Servidor desligado!'

@app.errorhandler(Exception)
def error(error):
    return error, 500