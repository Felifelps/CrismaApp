import background
from crismaapp import app

background.worker.start()

if __name__ == "__main__":
    app.run(host='0.0.0.0', debug=True, port=8080)
