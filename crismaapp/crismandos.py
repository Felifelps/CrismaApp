import datetime

from flask import request, render_template, redirect, session, flash, Blueprint

from models import Crismando, FrequenciaDomingo, FrequenciaEncontro, Encontro, Domingo

crismandos = Blueprint('crismandos', __name__)

@crismandos.route('/')
def listar_crismandos():
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
        '/adm/crismandos.html',
        data=data
    )


@crismandos.route('/new', methods=['POST', 'GET'])
def registrar_crismando():
    logged = session.get('logged')
    if not logged:
        flash('Faça login', 'red')
        return redirect('/login')

    if request.method == 'POST':
        data = request.form.to_dict()

        crismandos = Crismando.select()
        Crismando.create(
            id=max(crismandos, key=lambda c: c.id).id + 1 if len(crismandos) else 1,
            nome=data.get('nome'),
            data_nasc=datetime.date.fromisoformat(
                data.get('data')
            ),
            telefone=str(data.get('tel'))
        )

        flash('Crismando criado com sucesso', 'green')

        return redirect('/crismandos')

    return render_template(
        '/adm/registrar_crismando.html'
    )

@crismandos.route('/frequency/<int:crismando_id>')
@crismandos.route('/edit/<int:crismando_id>', methods=['POST', 'GET'])
def editar_crismando(crismando_id):
    logged = session.get('logged')
    editable = 'frequency' in request.url
    if not editable and not logged:
        flash('Faça login', 'red')
        return redirect('/login')

    crismando = Crismando.get_or_none(id=crismando_id)

    if not crismando:
        flash('Crismando não encontrado', 'red')
        return redirect('/crismandos')

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
                frequenciaencontro = FrequenciaEncontro.select()
                FrequenciaEncontro.create(
                    id=max(frequenciaencontro, key=lambda c: c.id).id + 1 if len(frequenciaencontro) else 1,
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
                frequenciadomingo = FrequenciaDomingo.select()
                FrequenciaDomingo.create(
                    id=max(frequenciadomingo, key=lambda c: c.id).id + 1 if len(frequenciadomingo) else 1,
                    domingo=domingo,
                    crismando=crismando,
                    justificado=value == 1
                )

        flash('Crismando atualizado com sucesso', 'green')

        return redirect('/crismandos')

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


@crismandos.route('/del/<int:crismando_id>')
def deletar_crismando(crismando_id):
    logged = session.get('logged')
    if not logged:
        flash('Faça login', 'red')
        return redirect('/login')

    crismando = Crismando.get_or_none(id=crismando_id)
    if not crismando:
        flash('Crismando não encontrado', 'red')
        return redirect('/crismandos')

    for f in FrequenciaEncontro.filter(crismando=crismando):
        f.delete_instance()

    for f in FrequenciaDomingo.filter(crismando=crismando):
        f.delete_instance()

    crismando.delete_instance()

    flash('Crismando excluido com sucesso', 'green')

    return redirect('/crismandos')
