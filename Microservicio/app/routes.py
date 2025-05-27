from flask import Blueprint, request, jsonify
from app.analysis import analyze_text
from app.deteccion_Comunidades import  construir_grafo_con_kmeans_sentimientos
from app.DeteccionComunidadEmociones import  construir_grafo_con_kmeans_emociones
from app.GrafoPrincipal import construir_grafo_sin_emociones
from app.Ausente import obtener_usuarios_ausentes


# Creamos un solo blueprint para todos los endpoints relacionados
api_blueprint = Blueprint("api", __name__)

# Endpoint de análisis de texto
@api_blueprint.route("/api/analizar", methods=["POST"])
def analizar():
    data = request.get_json()
    if not data or "texto" not in data:
        return jsonify({"error": "Falta el campo 'texto' en el JSON"}), 400

    resultado = analyze_text(data["texto"])
    return jsonify(resultado)

# Endpoint de detección de comunidades
@api_blueprint.route("/api/grafo")
def obtener_grafo():
    tipo = request.args.get("tipo")

    if tipo == "sentimiento":
        return jsonify(construir_grafo_con_kmeans_sentimientos())  # usa esa función aquí
    else:
        return jsonify({"error": "Tipo no válido"}), 400

# Endpoint de detección de comunidades
@api_blueprint.route("/api/grafoEmociones")
def obtener_grafo_emociones():
    tipo = request.args.get("tipo")

    if tipo == "emocion":
        return jsonify(construir_grafo_con_kmeans_emociones())  # usa esa función aquí
    else:
        return jsonify({"error": "Tipo no válido"}), 400
    
    
@api_blueprint.route("/api/grafoSinEmociones")
def obtener_grafo_sin_emociones():
    return jsonify(construir_grafo_sin_emociones())


    

@api_blueprint.route("/api/usuarios-ausentes", methods=["GET"])
def usuarios_ausentes():
    ausentes = obtener_usuarios_ausentes()

    # Convertir los ausentes en nodos del grafo
    nodes = [{"id": numero, "nombre": f"Usuario {i+1}"} for i, numero in enumerate(ausentes)]

    # No hay relaciones (links), así que dejamos vacío
    links = []

    return jsonify({"nodes": nodes, "links": links})
