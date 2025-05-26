from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import pipeline

app = Flask(__name__)
CORS(app)  # Esto permite solicitudes desde cualquier origen

# Inicializar los pipelines
sentiment_analyzer = pipeline(
    "text-classification",
    model="pysentimiento/robertuito-sentiment-analysis",
    top_k=1
)

emotion_analyzer = pipeline(
    "text-classification",
    model="pysentimiento/bert-base-uncased-emotion",
    top_k=1
)

irony_analyzer = pipeline(
    "text-classification",
    model="pysentimiento/robertuito-irony",
    top_k=1
)

translator = pipeline(
    "translation",
    model="Helsinki-NLP/opus-mt-es-en"
)

toxicity_analyzer = pipeline(
    "text-classification",
    model="unitary/toxic-bert",
    top_k=5
)

# Función principal de análisis
def analyze_text(text):
    sentiment = sentiment_analyzer(text)[0][0]
    irony = irony_analyzer(text)[0][0]
    translated_text = translator(text, max_length=512)[0]['translation_text']
    toxicity_results = toxicity_analyzer(translated_text)[0]
    emotion = emotion_analyzer(translated_text)[0][0]

    return {
        "texto_original": text,
        "texto_traducido": translated_text,
        "sentimiento": {
            "label": sentiment['label'],
            "score": round(sentiment['score'], 2)
        },
        "emocion": {
            "label": emotion['label'],
            "score": round(emotion['score'], 2)
        },
        "ironia": {
            "label": irony['label'],
            "score": round(irony['score'], 2)
        },
        "toxicidad": [
            {"label": r['label'], "score": round(r['score'], 2)} for r in toxicity_results
        ]
    }

# Endpoint para análisis
@app.route("/analizar", methods=["POST"])
def analizar():
    data = request.get_json()
    if not data or "texto" not in data:
        return jsonify({"error": "Falta el campo 'texto' en el JSON"}), 400

    resultado = analyze_text(data["texto"])
    return jsonify(resultado)

# Ejecutar app
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)
