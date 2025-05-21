const Message = require('../models/messageModel');
const { ObjectId } = require('mongoose').Types;

async function getMessageById(_id) {
    try {
        // Validar y convertir a ObjectId
        const objectId = new ObjectId(_id);

        // Buscar el mensaje
        const message = await Message.findById(objectId);

        if (!message) {
            return null; // Lo manejas luego en la ruta
        }

        return message;
    } catch (error) {
        console.error('Error obteniendo el mensaje por ID:', error.message);
        throw error;
    }
}

module.exports = getMessageById;
