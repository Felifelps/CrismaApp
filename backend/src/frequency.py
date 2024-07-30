import os

from flask import request, render_template, send_file, redirect, session, flash, Blueprint
import pandas as pd

from src.models import Crismando, FrequenciaDomingo, FrequenciaEncontro, Encontro, Domingo

DATA_FILE_PATH = os.path.join(os.getcwd(), 'dados.xlsx')

frequency = Blueprint('frequency', __name__)

@frequency.route('/', methods=['POST', 'GET'])
def ver_frequencia():
    if session.get('logged'):
        return redirect('/crismandos/')

    if request.method == 'POST':
        nome = request.form['name'].strip().lower()
        for crismando in Crismando.select():
            if crismando.nome.lower() == nome:
                session['from_frequency_form'] = 3
                return redirect(f'/frequency/{crismando.id}')

        flash('Nome inválido')

    return render_template('frequencia_form.html')


@frequency.route('/<int:crismando_id>')
def frequencia(crismando_id):
    from_form = session.get('from_frequency_form')
    if not from_form:
        return redirect('/')

    session['from_frequency_form'] = from_form - 1

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
        frequencia_encontro=fe,
        data=crismando.get_frequency_data(enc, dom, fe, fd)
    )

@frequency.route('/general')
def general():
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
    df.to_excel(DATA_FILE_PATH, index=True)
    return send_file(DATA_FILE_PATH, as_attachment=False)
