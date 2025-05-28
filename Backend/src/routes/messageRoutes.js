const express = require('express');
const router = express.Router();
const saveMessageToDB = require('../services/saveMessageService');
const getMessagesFromDB = require('../services/obtenerMensajes');
const getMessageById = require('../services/ObtenerMensajePorId'); // importa el servicio



router.post('/', async (req, res) => {
    try {
        console.log('REQ.BODY:', req.body); // 👈 Esto te mostrará qué está llegando

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

router.get('/:_id', async (req, res) => {
    try {
        const { _id } = req.params;
        const message = await getMessageById(_id);

        if (!message) {
            return res.status(404).json({ error: 'Mensaje no encontrado' });
        }

        res.status(200).json(message);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el mensaje' });
    }
});



module.exports = router;
