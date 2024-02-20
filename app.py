from routes import app, db

app.run(host='0.0.0.0', debug=False, port=8080)

db.close()
