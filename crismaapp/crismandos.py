import datetime

from flask import request, render_template, redirect, session, flash

from .app import app
from .models import Crismando, FrequenciaDomingo, FrequenciaEncontro, Encontro, Domingo

@app.route('/adm')
def adm():
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
        '/adm/adm.html',
        data=data
    )


@app.route('/adm/crismando/novo', methods=['POST', 'GET'])
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

        return redirect('/adm')

    return render_template(
        '/adm/registrar_crismando.html'
    )

@app.route('/frequency/<int:crismando_id>')
@app.route('/adm/crismando/edit/<int:crismando_id>', methods=['POST', 'GET'])
def editar_crismando(crismando_id):
    logged = session.get('logged')
    editable = 'frequency' in request.url
    if not editable and not logged:
        flash('Faça login', 'red')
        return redirect('/login')

    crismando = Crismando.get_or_none(id=crismando_id)

    if not crismando:
        flash('Crismando não encontrado', 'red')
        return redirect('/adm')

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

        return redirect('/adm')

    fe = {e.encontro: e.justificado for e in FrequenciaEncontro.filter(
    crismando=crismando)}

    fd = {d.domingo: d.justificado for d in FrequenciaDomingo.filter(
        crismando=crismando)}

    return render_template(
        '/adm/editar_crismando.html',
        crismando=crismando,
        encontros=enc,
        domingos=dom,
        frequencia_encontro=fe,
        frequencia_domingo=fd,
        data=crismando.get_frequency_data(enc, dom, fe, fd),
        editable=editable
    )


@app.route('/adm/crismando/del/<int:crismando_id>')
def deletar_crismando(crismando_id):
    logged = session.get('logged')
    if not logged:
        flash('Faça login', 'red')
        return redirect('/login')

    crismando = Crismando.get_or_none(id=crismando_id)
    if not crismando:
        flash('Crismando não encontrado', 'red')
        return redirect('/adm')

    for f in FrequenciaEncontro.filter(crismando=crismando):
        f.delete_instance()

    for f in FrequenciaDomingo.filter(crismando=crismando):
        f.delete_instance()

    crismando.delete_instance()

    flash('Crismando excluido com sucesso', 'green')

    return redirect('/adm')
