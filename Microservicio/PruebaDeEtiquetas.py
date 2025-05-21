from transformers import AutoModelForSequenceClassification

# ============================
# Cargar modelos y mostrar etiquetas
# ============================

# Sentimiento
model_sent = AutoModelForSequenceClassification.from_pretrained("pysentimiento/robertuito-sentiment-analysis")
print("\n Etiquetas del modelo de Sentimiento:")
for idx, label in model_sent.config.id2label.items():
    print(f"  {idx}: {label}")

# Emoción
model_emo = AutoModelForSequenceClassification.from_pretrained("pysentimiento/bert-base-uncased-emotion")
print("\n Etiquetas del modelo de Emoción:")
for idx, label in model_emo.config.id2label.items():
    print(f"  {idx}: {label}")

# Ironía
model_irony = AutoModelForSequenceClassification.from_pretrained("pysentimiento/robertuito-irony")
print("\n Etiquetas del modelo de Ironía:")
for idx, label in model_irony.config.id2label.items():
    print(f"  {idx}: {label}")

# Toxicidad
model_tox = AutoModelForSequenceClassification.from_pretrained("unitary/toxic-bert")
print("\n Etiquetas del modelo de Toxicidad:")
for idx, label in model_tox.config.id2label.items():
    print(f"  {idx}: {label}")
