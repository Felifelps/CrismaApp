import os
import threading
import time

import requests

EXTERNAL_DOMAIN = os.environ.get('EXTERNAL_DOMAIN')

def background_task():
    while EXTERNAL_DOMAIN:
        print('REQUESTING')
        requests.get(
            EXTERNAL_DOMAIN,
            timeout=300
        )
        time.sleep(300)

worker = threading.Thread(target=background_task, daemon=True)
