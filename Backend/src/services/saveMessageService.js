const Message = require('../models/messageModel');

async function saveMessageToDB(message) {
    try {
        const formattedDate = new Date(message.timestamp * 1000);

        // Si es mensaje de grupo, usa message.author. Si no, usa message.from
        const senderId = message.author || message.from;
        const cleanNumber = senderId.replace(/@.*/, '');

        const newMessage = new Message({
            from: message.from,        // ID del grupo o del contacto
            number: cleanNumber,       // Número real del remitente
            body: message.body,
            timestamp: formattedDate,
        });

        await newMessage.save();
        console.log('Mensaje guardado en la base de datos');
    } catch (error) {
        console.error('Error guardando el mensaje en la base de datos:', error.message);
    }
}

module.exports = saveMessageToDB;
