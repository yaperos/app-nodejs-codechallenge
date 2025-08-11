const { Kafka } = require('kafkajs');
const kafka = new Kafka({
  clientId: process.env.KAFKA_CLIENT_ID || 'transactions-service-consumer',
  brokers: [process.env.KAFKA_BROKER || 'redpanda:9092']
});
const consumer = kafka.consumer({ groupId: 'transactions-group' });
async function connectConsumer() { await consumer.connect(); }
async function subscribeTransactionStatus(onMessage) {
  await consumer.subscribe({ topic: 'transaction.status', fromBeginning: true });
  await consumer.run({
    eachMessage: async ({ message }) => {
      const value = message.value.toString();
      let payload;
      try { payload = JSON.parse(value); } catch (_) { return; }
      await onMessage(payload);
    }
  });
}
module.exports = { consumer, connectConsumer, subscribeTransactionStatus };
