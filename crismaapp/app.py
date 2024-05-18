import pandas as pd
from flask import Flask, request, render_template, redirect, session, flash, send_file

from .models import Crismando, FrequenciaDomingo, FrequenciaEncontro, Encontro, Domingo
from .utils import SECRET_KEY, check_admin_password

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

@app.route('/dados/geral')
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
def error(error):
    return error, 500