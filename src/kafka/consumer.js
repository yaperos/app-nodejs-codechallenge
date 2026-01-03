const { Kafka } = require('kafkajs');
const { validateTransaction } = require('../antifraud/antifraud.service');
const { updateTransactionStatus } = require('../transactions/transaction.service');

const kafka = new Kafka({
  clientId: 'antifraud-service',
  brokers: [process.env.KAFKA_BROKERS]
});

const consumer = kafka.consumer({ groupId: 'antifraud-group' });

async function startConsumer() {
  await consumer.connect();
  await consumer.subscribe({ topic: 'transaction-created' });

  await consumer.run({
    eachMessage: async ({ message }) => {
      const transaction = JSON.parse(message.value.toString());

      await new Promise(resolve => setTimeout(resolve, Number(process.env.DELAY_MS)));
      const status = validateTransaction(transaction);
      await updateTransactionStatus(transaction.id, status);
    }
  });
}

module.exports = { startConsumer };
