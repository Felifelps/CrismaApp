import datetime

from flask import request, render_template, redirect, session, flash

from .app import app
from .models import Crismando, FrequenciaDomingo, FrequenciaEncontro, Encontro, Domingo

@app.route('/')
def mainpage():
    logged = session.get('logged')
    if not logged:
        flash('Faça login', 'red')
        return redirect('/login')

    data = {}
    total_encontros = len(Encontro.select())
    total_domingos = len(Domingo.select())
    for crismando in sorted(Crismando.select(), key=lambda crismando: crismando.nome):
        e = FrequenciaEncontro.filter(crismando=crismando)
        d = FrequenciaDomingo.filter(crismando=crismando)
        data[crismando] = {
            "faltas_encontros": total_encontros - len(e),
            "faltas_domingos": total_domingos - len(d)
        }

    return render_template(
        'mainpage.html',
        data=data
    )


@app.route('/crismando/novo', methods=['POST', 'GET'])
def registrar_crismando():
    logged = session.get('logged')
    if not logged:
        flash('Faça login', 'red')
        return redirect('/login')

    if request.method == 'POST':
        data = request.form.to_dict()

        Crismando.create(
            id=max(Crismando.select(), key=lambda c: c.id).id + 1,
            nome=data.get('nome'),
            data_nasc=datetime.date.fromisoformat(
                data.get('data')
            ),
            telefone=str(data.get('tel'))
        )

        flash('Crismando criado com sucesso', 'green')

        return redirect('/')

    return render_template('registrar_crismando.html')


@app.route('/crismando/edit/<int:crismando_id>', methods=['POST', 'GET'])
def editar_crismando(crismando_id):
    logged = session.get('logged')
    if not logged:
        flash('Faça login', 'red')
        return redirect('/login')

    crismando = Crismando.get_or_none(id=crismando_id)

    if not crismando:
        flash('Crismando não encontrado', 'red')
        return redirect('/')

    enc = Encontro.select().order_by(Encontro.data)
    dom = Domingo.select().order_by(Domingo.data)

    if request.method == 'POST':
        data = request.form.to_dict()
        crismando.nome = data.get('nome')
        crismando.data_nasc = datetime.date.fromisoformat(
            data.get('data')
        )
        crismando.telefone = data.get('tel')
        crismando.save()

        FrequenciaEncontro.delete().where(
            FrequenciaEncontro.crismando==crismando
        ).execute()

        for encontro in list(enc):
            value = int(data.get(f'e-{encontro.id}', False))
            if value:
                FrequenciaEncontro.create(
                    id=max(FrequenciaEncontro.select(), key=lambda c: c.id).id + 1,
                    encontro=encontro,
                    crismando=crismando,
                    justificado=value == 1
                )
        
        FrequenciaDomingo.delete().where(
            FrequenciaDomingo.crismando==crismando
        ).execute()

        for domingo in list(dom):
            value = int(data.get(f'd-{domingo.id}', False))
            if value:
                FrequenciaDomingo.create(
                    id=max(FrequenciaDomingo.select(), key=lambda c: c.id).id + 1,
                    domingo=domingo,
                    crismando=crismando,
                    justificado=value == 1
                )

        flash('Crismando atualizado com sucesso', 'green')

        return redirect('/')

    fe = {e.encontro: e.justificado for e in FrequenciaEncontro.filter(
    crismando=crismando)}
    n_enc_just = list(fe.values()).count(True)

    fd = {d.domingo: d.justificado for d in FrequenciaDomingo.filter(
        crismando=crismando)}
    n_dom_just = list(fd.values()).count(True)

    return render_template(
        'editar_crismando.html',
        crismando=crismando,
        encontros=enc,
        domingos=dom,
        frequencia_encontro=fe,
        frequencia_domingo=fd,
        data=[
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
        ]
    )

@app.route('/crismando/del/<int:crismando_id>')
def deletar_crismando(crismando_id):
    logged = session.get('logged')
    if not logged:
        flash('Faça login', 'red')
        return redirect('/login')

    crismando = Crismando.get_or_none(id=crismando_id)
    if not crismando:
        flash('Crismando não encontrado', 'red')
        return redirect('/')

    for f in FrequenciaEncontro.filter(crismando=crismando):
        f.delete_instance()

    for f in FrequenciaDomingo.filter(crismando=crismando):
        f.delete_instance()

    crismando.delete_instance()

    flash('Crismando excluido com sucesso', 'green')

    return redirect('/')
