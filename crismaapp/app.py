import datetime

import pandas as pd
from flask import Flask, request, render_template, redirect, session, flash, send_file

from .models import Crismando, FrequenciaDomingo, FrequenciaEncontro, Encontro, Domingo
from .utils import SECRET_KEY, check_admin_password

app = Flask('Crisma')
app.secret_key = SECRET_KEY

@app.route('/', methods=['POST', 'GET'])
def ver_frequencia():
    if session.get('logged'):
        return redirect('/adm')

    if request.method == 'POST':
        nome = request.form['name'].strip().lower()
        data = datetime.date.fromisoformat(
            request.form['data']
        )
        crismando = Crismando.get_or_none(
            data_nasc=data
        )
        if crismando and crismando.nome.lower() == nome:
            session['from_frequency_form'] = True
            return redirect(f'/frequency/{crismando.id}')

        flash('Nome ou data de nascimento inválidos')

    return render_template('frequencia_form.html')


@app.route('/frequency/<int:crismando_id>')
def frequencia(crismando_id):
    if not session.get('from_frequency_form'):
        return redirect('/')

    session['from_frequency_form'] = False

    crismando = Crismando.get_or_none(id=crismando_id)

    if not crismando:
        flash('Crismando não encontrado', 'red')
        return redirect('/')

    enc = Encontro.select().order_by(Encontro.data)
    dom = Domingo.select().order_by(Domingo.data)

    fe = {e.encontro: e.justificado for e in FrequenciaEncontro.filter(
    crismando=crismando)}

    fd = {d.domingo: d.justificado for d in FrequenciaDomingo.filter(
        crismando=crismando)}

    return render_template(
        'frequencia.html',
        crismando=crismando,
        encontros=enc,
        domingos=dom,
        frequencia_encontro=fe,
        frequencia_domingo=fd,
        data=crismando.get_frequency_data(enc, dom, fe, fd)
    )


@app.route('/login', methods=['POST', 'GET'])
def login():
    if request.method == 'POST':
        password = request.form['password']

        if check_admin_password(password):
            session['logged'] = True
            return redirect('/adm')

        flash('Senha inválida')
    return render_template('login.html')


@app.route('/logout')
def logout():
    session['logged'] = False
    return redirect('/')


@app.route('/adm/dados/geral')
def dados_geral():
    enc = Encontro.select().order_by(Encontro.data)
    dom = Domingo.select().order_by(Domingo.data)

    pattern = ['Nome', 'PE', 'FE', 'JE', 'ET', 'PD', 'FD', 'JD', 'DT']
    data = {p: [] for p in pattern}
    for crismando in Crismando.select():
        fe = {e.encontro: e.justificado for e in FrequenciaEncontro.filter(
        crismando=crismando)}
        n_enc_just = list(fe.values()).count(True)

        fd = {d.domingo: d.justificado for d in FrequenciaDomingo.filter(
            crismando=crismando)}
        n_dom_just = list(fd.values()).count(True)

        for i, j in zip(pattern, [
            crismando.nome,
            # Encontros
            len(fe) - n_enc_just, # Presenças
            len(enc) - len(fe) + n_enc_just, # Faltas
            n_enc_just, # Justificados
            len(enc) - len(fe), # Faltas totais
            # Domingos
            len(fd) - n_dom_just, # Presenças
            len(dom) - len(fd) + n_dom_just, # Faltas
            n_dom_just, # Justificados
            len(dom) - len(fd), # Faltas totais
        ]):
            data[i].append(j)

    df = pd.DataFrame(data=data)
    df.to_excel('dados.xlsx', index=True)
    return send_file('dados.xlsx', as_attachment=False)


@app.errorhandler(Exception)
def error(e):
    return e, 500
