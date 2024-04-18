import threading
import time

import peewee
import requests

from .models import db, models, PostgresqlDatabase
from .utils import (
    model_to_dict,
    ONLINE_DATABASE_HOST,
    ONLINE_DATABASE_PORT,
    ONLINE_DATABASE_NAME,
    ONLINE_DATABASE_USER,
    ONLINE_DATABASE_PASSWORD
)

def set_up_second_database():
    try:
        second_db = PostgresqlDatabase(
            ONLINE_DATABASE_NAME,
            user=ONLINE_DATABASE_USER,
            password=ONLINE_DATABASE_PASSWORD,
            host=ONLINE_DATABASE_HOST,
            port=ONLINE_DATABASE_PORT
        )

        second_db.connect()

        for model in models:
            model._meta.database = second_db

        second_db.drop_tables(models)

        second_db.create_tables(models, safe=True)

        for model in models:
            model._meta.database = db

        return second_db
    except peewee.OperationalError:
        return None

def save_data(second_db):
    print('[SAVING DATA]')
    for model in models:
        print(f'  [SAVING {model.__name__} TABLE]', end="... ")
        data = []
        for row in model.select():
            data.append(model_to_dict(row))
        model._meta.database = second_db
        for row in data:
            try:
                model.create(**row)
            except peewee.IntegrityError:
                # Object already on database
                pass
        model._meta.database = db
        print('DONE!!!')
    print('[DATA SAVED SUCCESSFULLY]')

def background_task():
    saving_interval = 1 # In hour
    second_db = set_up_second_database()
    save = second_db is not None

    while True:
        if save:
            save_data(second_db)
        else:
            print('[ONLINE DATABASE NOT SET]')

        for i in range(12 * int(saving_interval)):
            print('REQUESTING')
            requests.get(
                'https://crismafronteiro.onrender.com', 
                timeout=300
            )
            time.sleep(300)

worker = threading.Thread(target=background_task, daemon=True)