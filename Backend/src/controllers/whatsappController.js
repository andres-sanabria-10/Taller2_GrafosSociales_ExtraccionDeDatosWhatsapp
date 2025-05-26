const connectDB= require('../services/dbService');
const saveMessageToDB = require('../services/saveMessageService');  // Asegúrate de importar correctamente la función

console.log('connectDB cargado:', typeof connectDB);


async function setupClientEvents(client) {
    await connectDB();

    client.on('ready', async () => {
        console.log(' Cliente listo!');

        const chats = await client.getChats();
        const targetChatName = 'TallerGrafos';
        const chat = chats.find(c => c.name?.includes(targetChatName));

        if (!chat) return console.log('Chat no encontrado.');

        const messages = await chat.fetchMessages({ limit: 200 });
        messages.forEach(msg => saveMessageToDB(msg));
    });

    client.on('message', msg => {
        if (!msg.fromMe) saveMessageToDB(msg);
    });

    client.on('message_create', msg => {
        if (msg.fromMe) saveMessageToDB(msg);
    });

    client.on('disconnected', reason => {
        console.log('Cliente desconectado:', reason);
    });
}

module.exports = { setupClientEvents };
