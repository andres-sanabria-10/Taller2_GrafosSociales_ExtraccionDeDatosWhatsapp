from flask import Flask, jsonify, request
from flask_cors import CORS
from app.routes import api_blueprint  # aún puedes modularizar las rutas

app = Flask(__name__)
CORS(app)  # aplica CORS globalmente

app.register_blueprint(api_blueprint)

if __name__ == "__main__":
    app.run(debug=True, port=5001)
