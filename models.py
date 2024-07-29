import datetime
from peewee import CharField, Model, DateField, ForeignKeyField, BooleanField

from utils import ONLINE_DB

if ONLINE_DB:
    from peewee import PostgresqlDatabase

    from utils import (
        DATABASE_HOST,
        DATABASE_PORT,
        DATABASE_NAME,
        DATABASE_USER,
        DATABASE_PASSWORD
    )

    db = PostgresqlDatabase(
        DATABASE_NAME,
        user=DATABASE_USER,
        password=DATABASE_PASSWORD,
        host=DATABASE_HOST,
        port=DATABASE_PORT
    )
else:
    from peewee import SqliteDatabase

    db = SqliteDatabase('database.db')


class BaseModel(Model):
    class Meta:
        database = db


class Crismando(BaseModel):
    nome = CharField(unique=True)
    telefone = CharField()
    data_nasc = DateField(null=True)

    def get_data_nasc(self):
        if self.data_nasc is None:
            return 'none'
        return datetime.datetime.strptime(
            str(self.data_nasc), '%Y-%m-%d'
        ).strftime('%d/%m/%Y')

    @property
    def idade(self):
        if self.data_nasc is None:
            return 'none'
        hoje = datetime.date.today()
        date = self.data_nasc
        if isinstance(date, str):
            date = datetime.datetime.strptime(
                self.data_nasc,
                "%d/%m/%Y"
            ).date()
        return (hoje - date).days//365

    def get_frequency_data(self, enc, dom, fe, fd):
        n_enc_just = list(fe.values()).count(True)

        n_dom_just = list(fd.values()).count(True)

        return [
            # Encontros
            len(fe) - n_enc_just, # Presenças
            len(enc) - len(fe), # Faltas
            n_enc_just, # Justificados
            len(enc) - len(fe), # Faltas totais
            # Domingos
            len(fd) - n_dom_just, # Presenças
            len(dom) - len(fd), # Faltas
            n_dom_just, # Justificados
            len(dom) - len(fd), # Faltas totais
        ]



class Encontro(BaseModel):
    tema = CharField()
    data = DateField()


class FrequenciaEncontro(BaseModel):
    crismando = ForeignKeyField(Crismando)
    encontro = ForeignKeyField(Encontro)
    justificado = BooleanField(default=False)


class Domingo(BaseModel):
    data = DateField()


class FrequenciaDomingo(BaseModel):
    crismando = ForeignKeyField(Crismando)
    domingo = ForeignKeyField(Domingo)
    justificado = BooleanField(default=False)

models = [
    Crismando,
    Encontro,
    Domingo,
    FrequenciaEncontro,
    FrequenciaDomingo
]

db.connect()

db.create_tables(models, safe=True)
