import threading
import time

import requests

from crismaapp import app

def auto_request():
    while True:
        print('REQUESTING')
        requests.get('https://crismafronteiro.onrender.com', timeout=300)
        time.sleep(60)

threading.Thread(target=auto_request, daemon=True).start()

if __name__ == "__main__":
    app.run(host='0.0.0.0', debug=True, port=8080)
