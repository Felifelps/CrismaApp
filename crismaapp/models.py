from peewee import PostgresqlDatabase, CharField, Model, DateField, ForeignKeyField

import datetime

from .utils import DATABASE_HOST, DATABASE_PORT, DATABASE_NAME, DATABASE_USER, DATABASE_PASSWORD

db = PostgresqlDatabase(
    DATABASE_NAME,
    user=DATABASE_USER,
    password=DATABASE_PASSWORD,
    host=DATABASE_HOST,
    port=DATABASE_PORT
)


class Crismando(Model):
    nome = CharField(unique=True)
    telefone = CharField()
    data_nasc = DateField(formats=['%d/%m/%y'], null=True)

    @property
    def idade(self):
        if self.data_nasc == None:
            return 'none'
        hoje = datetime.date.today()
        return (hoje - self.data_nasc).days//365

    class Meta:
        database = db


class Encontro(Model):
    tema = CharField()
    data = DateField(formats=['%d/%m/%y'])

    class Meta:
        database = db


class FrequenciaEncontro(Model):
    crismando = ForeignKeyField(Crismando)
    encontro = ForeignKeyField(Encontro)

    class Meta:
        database = db

class Domingo(Model):
    data = DateField(formats=['%d/%m/%y'])

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
