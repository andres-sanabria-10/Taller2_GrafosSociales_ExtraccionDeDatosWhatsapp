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

const { ObjectId } = require('mongoose').Types; // Importa ObjectId desde Mongoose

router.get('/:_id', async (req, res) => {
    try {
        const { _id } = req.params;

        // Convierte el string _id a ObjectId
        const objectId = new ObjectId(_id);

        // Busca el mensaje por _id
        const message = await Message.findById(objectId);

        if (!message) {
            return res.status(404).json({ error: 'Mensaje no encontrado' });
        }

        res.status(200).json(message);
    } catch (error) {
        // Captura errores, como si el _id no es válido
        console.error('Error al obtener el mensaje:', error.message);
        res.status(500).json({ error: 'Error al obtener el mensaje' });
    }
});



module.exports = router;
