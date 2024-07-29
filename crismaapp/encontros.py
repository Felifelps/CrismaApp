import datetime

from flask import request, render_template, redirect, session, flash, Blueprint

from models import Crismando, FrequenciaEncontro, Encontro

encontros = Blueprint('encontros', __name__)

@encontros.route('/')
def listar_encontros():
    logged = session.get('logged')
    if not logged:
        flash('Faça login', 'red')
        return redirect('/login')

    data = {}
    encontros_data = Encontro.select().order_by(Encontro.data)
    for encontro in list(encontros_data):
        data[encontro] = FrequenciaEncontro.filter(encontro=encontro)

    return render_template(
        '/adm/encontros.html',
        data=data
    )


@encontros.route('/new', methods=['POST', 'GET'])
def registrar_encontro():
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

        encontros = Encontro.select()
        encontro = Encontro.create(
            id=max(tuple(encontros), key=lambda c: c.id).id + 1 if len(encontros) else 1,
            tema=data.get('tema'),
            data=datetime.date.fromisoformat(
                data.get('data')
            )
        )

        for crismando in crismandos:
            value = int(data.get(f'{crismando.id}', False))
            if value:
                frequenciaencontro = FrequenciaEncontro.select()
                FrequenciaEncontro.create(
                    id=max(frequenciaencontro, key=lambda c: c.id).id + 1 if len(frequenciaencontro) else 1,
                    encontro=encontro,
                    crismando=crismando,
                    justificado=value == 1
                )

        flash('Encontro criado com sucesso', 'green')

        return redirect('/encontros')

    return render_template(
        '/adm/registrar_encontro.html',
        crismandos=crismandos
    )


@encontros.route('/edit/<int:encontro_id>', methods=['POST', 'GET'])
def editar_encontro(encontro_id):
    logged = session.get('logged')
    if not logged:
        flash('Faça login', 'red')
        return redirect('/login')

    encontro = Encontro.get_or_none(id=encontro_id)
    if not encontro:
        flash('Encontro não encontrado', 'red')
        return redirect('/encontros')

    crismandos = list(sorted(
        Crismando.select(),
        key=lambda crismando: crismando.nome
    ))

    if request.method == 'POST':
        data = request.form.to_dict()

        encontro.tema = data.get('tema')
        encontro.data = datetime.date.fromisoformat(
            data.get('data')
        )
        encontro.save()

        FrequenciaEncontro.delete().where(
            FrequenciaEncontro.encontro==encontro
        ).execute()

        for crismando in crismandos:
            value = int(data.get(f'{crismando.id}', False))
            if value:
                frequenciaencontro = FrequenciaEncontro.select()
                FrequenciaEncontro.create(
                    id=max(frequenciaencontro, key=lambda c: c.id).id + 1 if len(frequenciaencontro) else 1,
                    encontro=encontro,
                    crismando=crismando,
                    justificado=value == 1
                )

        flash('Encontro atualizado com sucesso', 'green')

        return redirect('/encontros')

    return render_template(
        '/adm/editar_encontro.html',
        encontro=encontro,
        crismandos=crismandos,
        frequencia={f.crismando: f.justificado for f in FrequenciaEncontro.filter(encontro=encontro)}
    )


@encontros.route('/del/<int:encontro_id>')
def deletar_encontro(encontro_id):
    logged = session.get('logged')
    if not logged:
        flash('Faça login', 'red')
        return redirect('/login')

    encontro = Encontro.get_or_none(id=encontro_id)
    if not encontro:
        flash('Encontro não encontrado', 'red')
        return redirect('/encontros')

    for f in FrequenciaEncontro.filter(encontro=encontro):
        f.delete_instance()
    encontro.delete_instance()

    flash('Encontro deletado com sucesso', 'green')

    return redirect('/encontros')
