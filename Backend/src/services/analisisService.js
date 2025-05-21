const axios = require('axios');

async function analizarMensaje(texto) {
  try {
    const respuesta = await axios.post('http://localhost:5001/analizar', {
      texto,
    });
    return respuesta.data;
  } catch (error) {
    console.error('Error llamando al microservicio Flask:', error.message);
    throw error;
  }
}

module.exports = analizarMensaje;
