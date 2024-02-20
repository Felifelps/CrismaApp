import datetime
import os
import time
import threading
import socket
import subprocess

from flask import Flask, request, render_template, redirect

from models import Crismando, Encontro, FrequenciaEncontro, db, Domingo, FrequenciaDomingo

data = subprocess.run(
    [
        'netsh', 
        'wlan', 
        'show', 
        'interfaces'
    ],
    capture_output=True,
    text=True,
    check=True
).stdout

ssid_line = [line for line in data.splitlines() if 'SSID' in line][0]
ssid = ssid_line.split(':')[-1].strip()

app = Flask(
    'Crisma', 
    template_folder=os.path.join('_internal', 'templates'),
    static_folder=os.path.join('_internal', 'static')
)

app.config['SSID'] = ssid
app.config['MACHINE_IP'] = socket.gethostbyname(socket.gethostname())


@app.context_processor
def contexto_global():
    return {
        'machine_ip': app.config['MACHINE_IP'],
        'ssid': app.config['SSID']
    }


@app.route('/')
def mainpage():
    try: 
        a = render_template(
        'mainpage.html',
        crismandos=list(sorted(Crismando.select(), key=lambda crismando: crismando.nome)),
        frequencia_encontro=FrequenciaEncontro.select(),
        frequencia_domingo=FrequenciaDomingo.select(),
    )
    except Exception as e: 
        input(e)
    return render_template(
        'mainpage.html',
        crismandos=list(sorted(Crismando.select(), key=lambda crismando: crismando.nome)),
        frequencia_encontro=FrequenciaEncontro.select(),
        frequencia_domingo=FrequenciaDomingo.select(),
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
    return render_template(
        'encontros.html',
        encontros=Encontro.select(),
        frequencia=FrequenciaEncontro.select()
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
    return render_template(
        'domingos.html',
        domingos=Domingo.select(),
        frequencia=FrequenciaDomingo.select()
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