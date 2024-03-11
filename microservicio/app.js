const express = require('express');
const cors = require('cors');
const { connect: connectKafka } = require('./services/kafka.service'); // Importa la función connect de tu servicio de Kafka
const { sequelize, testDatabaseConnection } = require('./config/databaseConfig');
const app = express();
const PORT = process.env.PORT || 3000;

// Importar las rutas
const transactionRoutes = require('./routes/transactionRoutes');

// Middleware para parsear JSON en las solicitudes
app.use(express.json());

// Configuración básica de CORS
app.use(cors());


// Usar las rutas
app.use('/api', transactionRoutes); // Esto asume que todas tus rutas están bajo /api

// Middleware para conectar con Kafka al iniciar la aplicación
async function kafkaMiddleware() {
  try {
    await connectKafka(); // Conecta con Kafka
    console.log('Conexión a Kafka establecida');
  } catch (error) {
   console.error('Error al conectar con Kafka:', error);
  }
}

// Llama al middleware de Kafka
kafkaMiddleware();

// Manejador de rutas no encontradas
app.use((req, res, next) => {
  res.status(404).send('Ruta no encontrada');
});

// Manejador de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ message: err.message || 'Error interno del servidor' });
});

// Verificar la conexión a la base de datos y luego iniciar el servidor
testDatabaseConnection()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Servidor Express en ejecución en el puerto ${PORT}`);
    });
  })
  .catch(error => {
    console.error('Error al iniciar el servidor:', error);
  });
