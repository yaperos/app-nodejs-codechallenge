const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'transaction-service',
  brokers: [process.env.KAFKA_BROKERS]
});

const producer = kafka.producer();

async function sendTransactionEvent(transaction) {
  await producer.connect();
  await producer.send({
    topic: 'transaction-created',
    messages: [
      { value: JSON.stringify(transaction) }
    ]
  });
}

module.exports = { sendTransactionEvent };
