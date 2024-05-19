import threading
import time
import requests

def background_task():
    while True:
        print('REQUESTING')
        requests.get(
            'https://crismafronteiro.onrender.com', 
            timeout=300
        )
        time.sleep(300)

worker = threading.Thread(target=background_task, daemon=True)