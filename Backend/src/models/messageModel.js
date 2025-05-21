const mongoose = require('mongoose');

const toxicidadSchema = new mongoose.Schema({
  label: { type: String },
  score: { type: Number }
}, { _id: false });

const analisisSchema = new mongoose.Schema({
  texto_traducido: { type: String },
  sentimiento: {
    label: { type: String },
    score: { type: Number }
  },
  emocion: {
    label: { type: String },
    score: { type: Number }
  },
  ironia: {
    label: { type: String },
    score: { type: Number }
  },
  toxicidad: [toxicidadSchema]
}, { _id: false });

const messageSchema = new mongoose.Schema({
  from: { type: String, required: true },
  number: { type: String, required: true },
  body: { type: String, required: true },
  timestamp: { type: Date, required: true },
  analisis: analisisSchema, // campo que agrupa todo el análisis
  analyzed: { type: Boolean, default: false }
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
