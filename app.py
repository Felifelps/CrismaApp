import background, os
from crismaapp import app

os.system('ls')
print(os.listdir())

background.worker.start()

if __name__ == "__main__":
    app.run(host='0.0.0.0', debug=True, port=8080)
