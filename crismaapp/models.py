import datetime
from peewee import PostgresqlDatabase, CharField, Model, DateField, ForeignKeyField

from .utils import DATABASE_HOST, DATABASE_PORT, DATABASE_NAME, DATABASE_USER, DATABASE_PASSWORD

db = PostgresqlDatabase(
    DATABASE_NAME,
    user=DATABASE_USER,
    password=DATABASE_PASSWORD,
    host=DATABASE_HOST,
    port=DATABASE_PORT
)

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


class Encontro(BaseModel):
    tema = CharField()
    data = DateField()


class FrequenciaEncontro(BaseModel):
    crismando = ForeignKeyField(Crismando)
    encontro = ForeignKeyField(Encontro)

class Domingo(BaseModel):
    data = DateField()


class FrequenciaDomingo(BaseModel):
    crismando = ForeignKeyField(Crismando)
    domingo = ForeignKeyField(Domingo)

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
