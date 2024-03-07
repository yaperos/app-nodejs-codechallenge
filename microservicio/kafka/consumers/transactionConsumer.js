const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'my-app',
  brokers: ['kafka1:9092', 'kafka2:9092']
});

const consumer = kafka.consumer({ groupId: 'test-group' });

async function connect() {
  await consumer.connect();
  await consumer.subscribe({ topic: 'transaction-state-topic', fromBeginning: true });
}

async function startListening(callback) {
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      callback(message.value);
    }
  });
}

module.exports = { connect, startListening };
