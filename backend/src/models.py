import datetime

import peewee
from bcrypt import checkpw

from src import utils

if utils.ONLINE_DB:
    db = peewee.PostgresqlDatabase(
        utils.DATABASE_NAME,
        user=utils.DATABASE_USER,
        password=utils.DATABASE_PASSWORD,
        host=utils.DATABASE_HOST,
        port=utils.DATABASE_PORT
    )
else:
    db = peewee.SqliteDatabase('database.db')


class BaseModel(peewee.Model):
    class Meta:
        database = db


class Crismando(BaseModel):
    nome = peewee.CharField(unique=True)
    telefone = peewee.CharField()
    data_nasc = peewee.DateField(null=True)

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
    tema = peewee.CharField()
    data = peewee.DateField()


class FrequenciaEncontro(BaseModel):
    crismando = peewee.ForeignKeyField(Crismando)
    encontro = peewee.ForeignKeyField(Encontro)
    justificado = peewee.BooleanField(default=False)


class Domingo(BaseModel):
    data = peewee.DateField()


class FrequenciaDomingo(BaseModel):
    crismando = peewee.ForeignKeyField(Crismando)
    domingo = peewee.ForeignKeyField(Domingo)
    justificado = peewee.BooleanField(default=False)


class User(BaseModel):
    username = peewee.CharField(max_length=50, primary_key=True)
    email = peewee.CharField(max_length=50)
    password = peewee.CharField(max_length=200)
    is_admin = peewee.BooleanField(default=False)
    is_active = peewee.BooleanField(default=True)
    created_at = peewee.DateTimeField(default=datetime.datetime.now)

    def check_password(self, password):
        return checkpw(
            bytes(password, encoding='utf-8'),
            bytes(self.password, encoding='utf-8')
        )


models = (
    Crismando,
    Encontro,
    Domingo,
    FrequenciaEncontro,
    FrequenciaDomingo,
    User
)

db.connect()

db.create_tables(models, safe=True)

db.close()
