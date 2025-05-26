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
    model="pysentimiento/bert-base-uncased-emotion",
    top_k=1
)

# Ironía
irony_analyzer = pipeline(
    "text-classification",
    model="pysentimiento/robertuito-irony",
    top_k=1
)

# Traducción español → inglés (solo para el modelo de toxicidad)
translator = pipeline(
    "translation",
    model="Helsinki-NLP/opus-mt-es-en"
)

# Toxicidad (modelo en inglés, requiere texto traducido)
toxicity_analyzer = pipeline(
    "text-classification",
    model="unitary/toxic-bert",
    top_k=5
)

# Función principal
def analyze_text(text):
    # Análisis en español
    sentiment = sentiment_analyzer(text)[0][0]
    irony = irony_analyzer(text)[0][0]

    # Traducir solo para toxicidad
    translated_text = translator(text, max_length=512)[0]['translation_text']
    toxicity_results = toxicity_analyzer(translated_text)[0]
    emotion = emotion_analyzer(translated_text)[0][0]


    print("Texto original:", text)
    print("Sentimiento detectado:", sentiment['label'], " Score:", round(sentiment['score'], 2))
    print("Emoción dominante:", emotion['label'], " Score:", round(emotion['score'], 2))
    print("¿Ironía detectada?:", irony['label'], " Score:", round(irony['score'], 2))
    print("Texto traducido (para toxicidad):", translated_text)

    print("\nClasificación de toxicidad:")
    for result in toxicity_results:
        print(f" - {result['label']}: {round(result['score'], 2)}")

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
    "foto sin ropa","eres un estipido","Eres la peor persona que he conocido. A nadie le caes bien."
    ,"Ojalá te mueras de la forma más dolorosa, pedazo de basura.","Eres un maldito imbécil que solo habla mierda por la boca.",
    "Si te vuelvo a ver, te rompo las piernas.","Eres un perdedor patético. Haznos un favor y cállate.",
    "La gente como tú negra no merece tener derechos."
]

# Ejecutar pruebas
for texto in ejemplos:
    print("\n-----------------------------")
    analyze_text(texto)
