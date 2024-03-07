const { Kafka } = require('kafkajs');

// Configuración de Kafka
const kafka = new Kafka({
  clientId: 'my-app',
  brokers: ['kafka1:9092', 'kafka2:9092'] // Direcciones de los brokers de Kafka
});

// Creación del productor y el consumidor
const producer = kafka.producer();
const consumer = kafka.consumer({ groupId: 'test-group' });

// Función para conectar el productor y el consumidor a Kafka
const connect = async () => {
  try {
    // Conectar el productor
    await producer.connect();
    console.log('Productor conectado a Kafka.');

    // Conectar el consumidor
    await consumer.connect();
    console.log('Consumidor conectado a Kafka.');
  } catch (error) {
    console.error('Error al conectar con Kafka:', error);
    throw error; // Relanza el error para que se pueda manejar en el código que importa este módulo
  }
};

module.exports = { kafka, producer, consumer, connect };
