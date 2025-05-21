const Message = require('../models/messageModel');
const analizarMensaje = require('./analisisService'); // asegúrate que la ruta es correcta

async function saveMessageToDB(message) {
    try {
        const formattedDate = new Date(message.timestamp * 1000);
        const senderId = message.author || message.from;
        const cleanNumber = senderId.replace(/@.*/, '');

        const analisis = await analizarMensaje(message.body);

        const newMessage = new Message({
            from: message.from,
            number: cleanNumber,
            body: message.body,
            timestamp: formattedDate,
            analisis: analisis,
            analyzed: true
        });

        await newMessage.save();
        console.log('Mensaje guardado y analizado');
    } catch (error) {
        console.error('Error guardando o analizando el mensaje:', error.message);
    }
}

module.exports = saveMessageToDB;
