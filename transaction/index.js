const express = require('express');
const { Kafka } = require('kafkajs');
const initDatabase = require('./src/models/initDatabase')
require('dotenv').config()

const transactionRoutes = require('./src/routes/index');
const {TransactionService} = require('./src/services/transactionService')
const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json());

const kafka = new Kafka({
  clientId: process.env.CLIENT_ID,
  brokers: [process.env.BROKER], 
});

const producer = kafka.producer();

const runProducer = async () => {
  await producer.connect();
  console.log('Productor de Kafka conectado');
};

const consumer = kafka.consumer({ groupId: process.env.GROUP_ID });

const runConsumer = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: 'transaction-validation-topic', fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const response = JSON.parse(message.value.toString());
      console.log('Respuesta recibida:', response);

      await TransactionService.update(response.status, response.id)
      let getTransaction = await TransactionService.get(response.id)
      await producer.send({
        topic: 'transaction-update',
        messages: [{ value: JSON.stringify(getTransaction) }],
      });
    },
  });
};

runConsumer().catch(e => console.error(`[transaction-service/consumer] ${e.message}`, e));

app.use((req, res, next) => {
  req.producer = producer;
  next();
});

app.use('/transactions', transactionRoutes);

initDatabase().then(() => {
  app.listen(PORT, async () => {
    console.log(`Servidor de transacciones corriendo en el puerto ${PORT}`);
    try {
      await runProducer();
    } catch (error) {
      console.error('Error al iniciar el productor de Kafka', error);
      process.exit(1); 
    }
  });
})
const signalTraps = ['SIGTERM', 'SIGINT', 'SIGUSR2'];
signalTraps.forEach(type => {
  process.once(type, async () => {
    try {
      await producer.disconnect();
      console.log(`[transaction-service] Productor de Kafka desconectado en ${type}`);
    } finally {
      process.exit(0);
    }
  });
});
