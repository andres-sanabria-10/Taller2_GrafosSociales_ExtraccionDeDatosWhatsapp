from transformers import pipeline

# Análisis de sentimiento (positivo, negativo, neutral)
sentiment_analyzer = pipeline(
    "text-classification",
    model="pysentimiento/robertuito-sentiment-analysis",
    top_k=1
)

# Análisis de emociones (en español)
emotion_analyzer = pipeline(
    "text-classification",
    model="finiteautomata/beto-emotion-analysis",  # <--- CAMBIADO A ESPAÑOL
    top_k=1
)

# Ironía
irony_analyzer = pipeline(
    "text-classification",
    model="pysentimiento/robertuito-irony",
    top_k=1
)

# Toxicidad (multiclase)
toxicity_analyzer = pipeline(
    "text-classification",
    model="unitary/toxic-bert",
    top_k=5
)

# Función de detección de toxicidad
def detect_toxicity(text):
    # Ejecutar modelos
    sentiment = sentiment_analyzer(text)[0][0]
    emotion = emotion_analyzer(text)[0]
    irony = irony_analyzer(text)[0][0]
    toxicity_results = toxicity_analyzer(text)[0]

    # Mostrar resultados
    print("Texto:", text)
    print("Sentimiento detectado:", sentiment['label'], " Score:", round(sentiment['score'], 2))
    print("Emoción dominante:", emotion['label'], " Score:", round(emotion['score'], 2))
    print("¿Ironía detectada?:", irony['label'], " Score:", round(irony['score'], 2))

    print("\nClasificación de toxicidad:")
    for result in toxicity_results:
        label = result['label']
        score = result['score']
        print(f" - {label}: {round(score, 2)}")

    # Heurística de toxicidad
    toxic_labels = ["toxic", "insult", "threat", "obscene", "identity_hate"]
    is_toxic = any(
        result['label'] in toxic_labels and result['score'] > 0.5
        for result in toxicity_results
    )

    if (
        sentiment["label"] == "NEG" or
        emotion["label"] in ["enojo", "disgusto"] or  # emociones en español
        irony["label"] == "irony" or
        is_toxic
    ):
        print("⚠️ ADVERTENCIA: Posible contenido tóxico o manipulador detectado.")
    else:
        print("✅ No se detectó contenido tóxico.")

# Lista de ejemplos
ejemplos = [
    "Eres un inútil, no sirves para nada.",
    "Te deseo lo mejor en tu día ",
    "No me gusta cómo haces tu trabajo.",
    "Odio cuando me interrumpen.",
    "estoy demasiado emocionado",
    "#NosUnimosONosJodemos Vamos juntos por el cambio, mire el miedo que le tienen. @petrogustavo Mi presidente",
    "Claro, como tú siempre tienes la razón... ",
    "hoy me siento alegria",
    "No me gusta cómo hablas, eres muy grosero y ofensivo. ajajajaja quiero romperla porque no entiendo porque no se entendera o me muestra mas valores",
]

# Ejecutar pruebas
for texto in ejemplos:
    print("\n-----------------------------")
    detect_toxicity(texto)
