from peewee import SqliteDatabase, CharField, Model, DateField, ForeignKeyField

import datetime

# Defina o modelo Peewee
db = SqliteDatabase('data.db')

class Crismando(Model):
    nome = CharField(unique=True)
    telefone = CharField()
    data_nasc = DateField(formats='%d/%m/%y')

    @property
    def idade(self):
        if self.data_nasc == 'none':
            return 'none'
        hoje = datetime.datetime.today()
        data = datetime.datetime.strptime(self.data_nasc, '%d/%m/%y')
        return (hoje - data).days//365

    class Meta:
        database = db


class Encontro(Model):
    tema = CharField()
    data = DateField(formats='%d/%m/%y')

    class Meta:
        database = db


class FrequenciaEncontro(Model):
    crismando = ForeignKeyField(Crismando)
    encontro = ForeignKeyField(Encontro)

    class Meta:
        database = db

class Domingo(Model):
    data = DateField(formats='%d/%m/%y')

    class Meta:
        database = db


class FrequenciaDomingo(Model):
    crismando = ForeignKeyField(Crismando)
    domingo = ForeignKeyField(Domingo)

    class Meta:
        database = db

# Conecte-se ao banco de dados
db.connect()

# Crie tabelas no banco de dados

db.create_tables([
        Crismando,
        FrequenciaEncontro,
        Encontro,
        Domingo,
        FrequenciaDomingo
    ], safe=True)

