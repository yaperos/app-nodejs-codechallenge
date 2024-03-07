const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'my-app',
  brokers: ['kafka1:9092', 'kafka2:9092']
});

const producer = kafka.producer();

async function connect() {
  await producer.connect();
}

async function sendTransactionState(transactionId, newState) {
  await producer.send({
    topic: 'transaction-state-topic',
    messages: [
      { key: transactionId, value: newState }
    ]
  });
}

module.exports = { connect, sendTransactionState };
