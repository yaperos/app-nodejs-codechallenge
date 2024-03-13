const { Kafka, Partitioners } = require('kafkajs');

// Configuración de Kafka
const kafka = new Kafka({
  clientId: 'my-app',
  brokers: ['localhost:9092']
  //brokers: ['kafka:29092']
  //brokers: ['172.25.0.4:9092'] // Dirección IP del broker de Kafka
  //brokers: ['app-nodejs-codechallenge-kafka-1:9092']
});

// Creación del productor y el consumidor
const producer = kafka.producer({
  createPartitioner: Partitioners.LegacyPartitioner // Agregar esta línea para utilizar el particionador Legacy
});
const consumer = kafka.consumer({ groupId: 'test-group' });

// Función para conectar el productor y el consumidor a Kafka
async function connect() {
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
}

async function disconnect() {
  await producer.disconnect();
  await consumer.disconnect();
}

async function sendToTopic(topic, message) {
  console.log(`Enviando mensaje al tema ${topic}: ${message}`);
  await producer.send({
    topic: topic,
    messages: [{ value: message }]
  });
}

async function subscribeToTopic(topic, callback) {
  await consumer.subscribe({ topic: topic, fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      callback(message.value.toString());
    },
  });
}

module.exports = { kafka, producer, consumer, connect, disconnect, sendToTopic, subscribeToTopic };
