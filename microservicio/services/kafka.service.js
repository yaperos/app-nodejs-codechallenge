const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'my-app',
  brokers: ['kafka1:9092', 'kafka2:9092']
});

const producer = kafka.producer();
const consumer = kafka.consumer({ groupId: 'test-group' });

async function connect() {
  await producer.connect();
  await consumer.connect();
}

async function disconnect() {
  await producer.disconnect();
  await consumer.disconnect();
}

async function sendToTopic(topic, message) {
  await producer.send({
    topic: topic,
    messages: [
      { value: message }
    ]
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

module.exports = { connect, disconnect, sendToTopic, subscribeToTopic };
