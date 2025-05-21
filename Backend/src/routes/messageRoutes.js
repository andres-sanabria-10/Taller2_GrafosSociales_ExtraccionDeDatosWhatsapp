const express = require('express');
const router = express.Router();
const saveMessageToDB = require('../services/saveMessageService');
const getMessagesFromDB = require('../services/obtenerMensajes');



router.post('/', async (req, res) => {
    try {
        const { from, body, timestamp } = req.body;
        const fakeMessage = {
            from,
            body,
            timestamp: Math.floor(new Date(timestamp).getTime() / 1000),
        };

        await saveMessageToDB(fakeMessage);
        res.status(201).json({ message: 'Mensaje guardado correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al guardar el mensaje' });
    }
});
router.get('/obtener', async (req, res) => {
    try {
        const messages = await getMessagesFromDB();
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los mensajes' });
    }
});


module.exports = router;
