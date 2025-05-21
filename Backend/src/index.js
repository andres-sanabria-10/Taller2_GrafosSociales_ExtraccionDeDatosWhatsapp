require('dotenv').config();
const express = require('express');
const cors = require('cors'); // <-- aquí
const { Client } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const connectDB = require('./services/dbService');
const { setupClientEvents } = require('./controllers/whatsappController');
const messageRoutes = require('./routes/messageRoutes');

const app = express();
const PORT = process.env.PORT || 3200;

// Middleware
app.use(cors()); // <-- aquí
app.use(express.json());
app.use('/api/messages', messageRoutes);

app.get('/ping', (req, res) => {
  res.send('pong');
});

async function startApp() {
  await connectDB(); 

  const client = new Client();

  client.on('qr', qr => {
    qrcode.generate(qr, { small: true });
  });

  client.initialize();
  setupClientEvents(client);

  app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
  });
}

startApp();
