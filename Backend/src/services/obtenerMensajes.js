const Message = require('../models/messageModel');

async function getMessagesFromDB() {
    try {
        const messages = await Message.find().sort({ timestamp: -1 }); // ordena por fecha descendente
        return messages;
    } catch (error) {
        console.error('Error obteniendo los mensajes de la base de datos:', error.message);
        throw error;
    }
}

module.exports = getMessagesFromDB;
