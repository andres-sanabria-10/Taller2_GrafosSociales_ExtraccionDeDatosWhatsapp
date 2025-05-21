const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const uri = process.env.DB_URI; 
    if (!uri) throw new Error('URI de MongoDB no definida en DB_URI');
    
    await mongoose.connect(uri);

    console.log('Conectado a MongoDB');
  } catch (error) {
    console.error('Error conectando a MongoDB:', error.message);
  }
};

module.exports = connectDB;
