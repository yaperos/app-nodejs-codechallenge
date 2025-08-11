const { Kafka, Partitioners } = require('kafkajs');
const kafka = new Kafka({
  clientId: process.env.KAFKA_CLIENT_ID || 'transactions-service',
  brokers: [process.env.KAFKA_BROKER || 'redpanda:9092']
});
const producer = kafka.producer({ createPartitioner: Partitioners.LegacyPartitioner });
async function connectProducer() { await producer.connect(); }
async function publishTransactionCreated(payload) {
  await producer.send({ topic: 'transaction.created', messages: [{ value: JSON.stringify(payload) }] });
}
module.exports = { producer, connectProducer, publishTransactionCreated };
