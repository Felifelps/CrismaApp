import datetime

from flask import request, render_template, redirect, session, flash

from .app_routes import app
from .models import Crismando, FrequenciaDomingo, Domingo


@app.route('/adm/domingos')
def domingos():
    logged = session.get('logged')
    if not logged:
        flash('Faça login', 'red')
        return redirect('/login')

    data = {}
    domingos_data = Domingo.select().order_by(Domingo.data)
    for domingo in list(domingos_data):
        data[domingo] = FrequenciaDomingo.filter(domingo=domingo)

    return render_template(
        '/adm/domingos.html',
        data=data
    )


@app.route('/adm/domingo/novo', methods=['POST', 'GET'])
def registrar_domingo():
    logged = session.get('logged')
    if not logged:
        flash('Faça login', 'red')
        return redirect('/login')

    crismandos = list(sorted(
        Crismando.select(),
        key=lambda crismando: crismando.nome
    ))

    if request.method == 'POST':
        data = request.form.to_dict()

        domingo = Domingo.create(
            id=max(Domingo.select(), key=lambda c: c.id).id + 1,
            data=datetime.date.fromisoformat(
                data.get('data')
            )
        )

        for crismando in crismandos:
            value = int(data.get(f'{crismando.id}', False))
            if value:
                FrequenciaDomingo.create(
                    id=max(FrequenciaDomingo.select(), key=lambda c: c.id).id + 1,
                    domingo=domingo,
                    crismando=crismando,
                    justificado=value == 1
                )

        flash('Domingo criado sucesso', 'green')

        return redirect('/adm/domingos')

    return render_template(
        '/adm/registrar_domingo.html',
        crismandos=crismandos
    )


@app.route('/adm/domingo/edit/<int:domingo_id>', methods=['POST', 'GET'])
def editar_domingo(domingo_id):
    logged = session.get('logged')
    if not logged:
        flash('Faça login', 'red')
        return redirect('/login')

    crismandos = list(sorted(
        Crismando.select(),
        key=lambda crismando: crismando.nome
    ))

    domingo = Domingo.get_or_none(id=domingo_id)
    if not domingo:
        flash('Domingo não encontrado', 'red')
        return redirect('/adm/domingos')

    if request.method == 'POST':
        data = request.form.to_dict()

        domingo.data = datetime.date.fromisoformat(
            data.get('data')
        )
        domingo.save()

        FrequenciaDomingo.delete().where(
            FrequenciaDomingo.domingo==domingo
        ).execute()

        for crismando in crismandos:
            value = int(data.get(f'{crismando.id}', False))
            if value:
                FrequenciaDomingo.create(
                    id=max(FrequenciaDomingo.select(), key=lambda c: c.id).id + 1,
                    domingo=domingo,
                    crismando=crismando,
                    justificado=value == 1
                )

        flash('Domingo atualizado com sucesso', 'green')

        return redirect('/adm/domingos')

    return render_template(
        '/adm/editar_domingo.html',
        domingo=domingo,
        crismandos=crismandos,
        frequencia={f.crismando: f.justificado for f in FrequenciaDomingo.filter(domingo=domingo)}
    )


@app.route('/adm/domingo/del/<int:domingo_id>')
def deletar_domingo(domingo_id):
    logged = session.get('logged')
    if not logged:
        flash('Faça login', 'red')
        return redirect('/login')

    domingo = Domingo.get_or_none(id=domingo_id)
    if not domingo:
        flash('Domingo não encontrado', 'red')
        return redirect('/adm/domingos')

    for f in FrequenciaDomingo.filter(domingo=domingo):
        f.delete_instance()
    domingo.delete_instance()

    flash('Domingo deletado com sucesso', 'green')

    return redirect('/adm/domingos')
