const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    from: String,
    number: String, // número limpio
    body: String,
    timestamp: Date,
    isRedFlag: Boolean, // indica si es red flag
    redFlagLabel: String, // tipo de red flag (ej: "toxic")
    redFlagScore: Number, // nivel de confianza del modelo
    analyzed: Boolean, // indica si el mensaje ya fue analizado
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;