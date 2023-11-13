
const { Kafka } = require('kafkajs');
require('dotenv').config()
const validateTransaction = require('./src/services/transactionValidator');

const kafka = new Kafka({
  clientId: process.env.CLIENT_ID,
  brokers: [process.env.BROKER], 
});

const producer = kafka.producer();
const consumer = kafka.consumer({ groupId: process.env.GROUP_ID });

const run = async () => {
  await producer.connect();

  await consumer.connect();

  await consumer.subscribe({ topic: 'transaction-topic', fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const transaction = JSON.parse(message.value.toString());
      const validationResult = await validateTransaction(transaction);

      console.log(`Transacción recibida en topic ${topic}:`, transaction);

      await producer.send({
        topic: 'transaction-validation-topic',
        messages: [
          { value: JSON.stringify({ id: transaction.id, status: validationResult.status }) },
        ],
      });
    },
  });
};

run().catch(e => console.error(`[anti-fraud-service/consumer] ${e.message}`, e));

const signalTraps = ['SIGTERM', 'SIGINT', 'SIGUSR2'];
signalTraps.forEach(type => {
  process.once(type, async () => {
    try {
      await consumer.disconnect();
      await producer.disconnect();
      console.log(`[anti-fraud-service] Disconnected from Kafka on ${type}`);
      process.exit(0);
    } catch (_) {
      process.exit(1);
    }
  });
});
