import datetime

from flask import Flask, request, render_template, redirect, session, flash

from .models import Crismando, Encontro, FrequenciaEncontro, Domingo, FrequenciaDomingo
from .utils import check_admin_password, SECRET_KEY

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


@app.route('/')
def mainpage():
    if not session.get('logged'):
        flash('Faça login', 'red')
        return redirect('/login')

    data = {}
    total_encontros = len(Encontro.select())
    total_domingos = len(Domingo.select())
    for crismando in sorted(Crismando.select(), key=lambda crismando: crismando.nome):
        e = FrequenciaEncontro.filter(crismando=crismando)
        d = FrequenciaDomingo.filter(crismando=crismando)
        data[crismando] = {
            "encontros": list(e),
            "domingos": list(d),
            "faltas_encontros": total_encontros - len(e),
            "faltas_domingos": total_domingos - len(d)
        }

    return render_template(
        'mainpage.html',
        data=data
    )


@app.route('/crismando/novo', methods=['POST', 'GET'])
def registrar_crismando():
    if not session.get('logged'):
        flash('Faça login', 'red')
        return redirect('/login')

    if request.method == 'POST':
        data = request.form.to_dict()

        Crismando.create(
            nome=data.get('nome'),
            data_nasc=datetime.date.fromisoformat(
                data.get('data')
            ),
            telefone=str(data.get('tel'))
        )

        flash('Crismando criado com sucesso', 'green')

        return redirect('/')

    return render_template('registrar_crismando.html')


@app.route('/crismando/edit/<int:id>', methods=['POST', 'GET'])
def editar_crismando(id):
    if not session.get('logged'):
        flash('Faça login', 'red')
        return redirect('/login')

    crismando = Crismando.get_or_none(id=id)

    if not crismando:
        flash('Crismando não encontrado', 'red')
        return redirect('/')

    if request.method == 'POST':
        data = request.form.to_dict()
        crismando.nome = data.get('nome')
        crismando.data_nasc = datetime.date.fromisoformat(
            data.get('data')
        )
        crismando.telefone = data.get('tel')
        crismando.save()

        for f in FrequenciaEncontro.filter(crismando=crismando):
            f.delete_instance()

        for encontro_id in request.form.getlist('encontros[]'):
            FrequenciaEncontro.create(
                encontro=Encontro.get_by_id(int(encontro_id)),
                crismando=crismando
            )

        for f in FrequenciaDomingo.filter(crismando=crismando):
            f.delete_instance()

        for domingo_id in request.form.getlist('domingos[]'):
            FrequenciaDomingo.create(
                domingo=Domingo.get_by_id(int(domingo_id)),
                crismando=crismando
            )

        flash('Crismando atualizado com sucesso', 'green')

        return redirect('/')

    return render_template(
        'editar_crismando.html',
        crismando=crismando,
        encontros=Encontro.select(),
        domingos=Domingo.select(),
        frequencia_encontro=list(map(lambda x: x.encontro,
                                FrequenciaEncontro.filter(crismando=crismando))),
        frequencia_domingo=list(map(lambda x: x.domingo,
                                FrequenciaDomingo.filter(crismando=crismando))),
    )


@app.route('/crismando/del/<int:id>')
def deletar_crismando(id):
    if not session.get('logged'):
        flash('Faça login', 'red')
        return redirect('/login')

    crismando = Crismando.get_or_none(id=id)
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


@app.route('/encontros')
def encontros():
    if not session.get('logged'):
        flash('Faça login', 'red')
        return redirect('/login')

    data = {}
    for encontro in Encontro.select():
        data[encontro] = FrequenciaEncontro.filter(encontro=encontro)

    return render_template(
        'encontros.html',
        data=data
    )


@app.route('/encontro/novo', methods=['POST', 'GET'])
def registrar_encontro():
    if not session.get('logged'):
        flash('Faça login', 'red')
        return redirect('/login')

    if request.method == 'POST':
        data = request.form.to_dict()

        encontro = Encontro.create(
            tema=data.get('tema'),
            data=datetime.date.fromisoformat(
                data.get('data')
            )
        )

        crismandos = request.form.getlist('crismandos[]')

        for crismando_id in crismandos:
            FrequenciaEncontro.create(
                crismando=Crismando.get_by_id(int(crismando_id)),
                encontro=encontro
        )

        flash('Encontro criado com sucesso', 'green')

        return redirect('/encontros')

    return render_template(
        'registrar_encontro.html',
        crismandos=list(sorted(Crismando.select(), key=lambda crismando: crismando.nome))
    )


@app.route('/encontro/edit/<int:id>', methods=['POST', 'GET'])
def editar_encontro(id):
    if not session.get('logged'):
        flash('Faça login', 'red')
        return redirect('/login')

    encontro = Encontro.get_or_none(id=id)
    if not encontro:
        flash('Encontro não encontrado', 'red')
        return redirect('/encontros')

    if request.method == 'POST':
        data = request.form.to_dict()

        encontro.tema = data.get('tema')
        encontro.data = datetime.date.fromisoformat(
            data.get('data')
        )
        encontro.save()

        crismandos = request.form.getlist('crismandos[]')

        for f in FrequenciaEncontro.filter(encontro=encontro):
            f.delete_instance()

        for crismando_id in crismandos:
            FrequenciaEncontro.create(
                crismando=Crismando.get_by_id(int(crismando_id)),
                encontro=encontro
            )

        flash('Encontro atualizado com sucesso', 'green')

        return redirect('/encontros')

    return render_template(
        'editar_encontro.html',
        encontro=encontro,
        crismandos=list(sorted(Crismando.select(), key=lambda crismando: crismando.nome)),
        frequencia=list(map(lambda f: f.crismando, FrequenciaEncontro.filter(encontro=encontro)))
    )


@app.route('/encontro/del/<int:id>')
def deletar_encontro(id):
    if not session.get('logged'):
        flash('Faça login', 'red')
        return redirect('/login')

    encontro = Encontro.get_or_none(id=id)
    if not encontro:
        flash('Encontro não encontrado', 'red')
        return redirect('/encontros')

    for f in FrequenciaEncontro.filter(encontro=encontro):
        f.delete_instance()
    encontro.delete_instance()

    flash('Encontro deletado com sucesso', 'green')

    return redirect('/encontros')


@app.route('/domingos')
def domingos():
    if not session.get('logged'):
        flash('Faça login', 'red')
        return redirect('/login')

    data = {}
    for domingo in Domingo.select():
        data[domingo] = FrequenciaDomingo.filter(domingo=domingo)

    return render_template(
        'domingos.html',
        data=data
    )


@app.route('/domingo/novo', methods=['POST', 'GET'])
def registrar_domingo():
    if not session.get('logged'):
        flash('Faça login', 'red')
        return redirect('/login')

    if request.method == 'POST':
        data = request.form.to_dict()

        domingo = Domingo.create(
            data=datetime.date.fromisoformat(
                data.get('data')
            )
        )

        crismandos = request.form.getlist('crismandos[]')

        for crismando_id in crismandos:
            FrequenciaDomingo.create(
                crismando=Crismando.get_by_id(int(crismando_id)),
                domingo=domingo
            )

        flash('Domingo criado sucesso', 'green')

        return redirect('/domingos')

    return render_template(
        'registrar_domingo.html',
        crismandos=list(sorted(Crismando.select(), key=lambda crismando: crismando.nome))
    )


@app.route('/domingo/edit/<int:id>', methods=['POST', 'GET'])
def editar_domingo(id):
    if not session.get('logged'):
        flash('Faça login', 'red')
        return redirect('/login')

    domingo = Domingo.get_or_none(id=id)
    if not domingo:
        flash('Domingo não encontrado', 'red')
        return redirect('/domingos')

    if request.method == 'POST':
        data = request.form.to_dict()

        domingo.data = datetime.date.fromisoformat(
            data.get('data')
        )
        domingo.save()

        crismandos = request.form.getlist('crismandos[]')

        for f in FrequenciaDomingo.filter(domingo=domingo):
            f.delete_instance()

        for crismando_id in crismandos:
            FrequenciaDomingo.create(
                crismando=Crismando.get_by_id(int(crismando_id)),
                domingo=domingo
            )

        flash('Domingo atualizado com sucesso', 'green')

        return redirect('/domingos')

    return render_template(
        'editar_domingo.html',
        domingo=domingo,
        crismandos=list(sorted(Crismando.select(), key=lambda crismando: crismando.nome)),
        frequencia=list(map(lambda f: f.crismando, FrequenciaDomingo.filter(domingo=domingo)))
    )


@app.route('/domingo/del/<int:id>')
def deletar_domingo(id):
    if not session.get('logged'):
        flash('Faça login', 'red')
        return redirect('/login')

    domingo = Domingo.get_or_none(id=id)
    if not domingo:
        flash('Domingo não encontrado', 'red')
        return redirect('/domingos')

    for f in FrequenciaDomingo.filter(domingo=domingo):
        f.delete_instance()
    domingo.delete_instance()

    flash('Domingo deletado com sucesso', 'green')

    return redirect('/domingos')


@app.errorhandler(Exception)
def error(error):
    return error, 500
