const { Kafka } = require('kafkajs');
const kafka = new Kafka({
  clientId: 'antifraud-mock',
  brokers: [process.env.KAFKA_BROKER || 'redpanda:9092']
});
async function run() {
  const consumer = kafka.consumer({ groupId: 'antifraud-mock-group' });
  const producer = kafka.producer();
  await consumer.connect();
  await producer.connect();
  await consumer.subscribe({ topic: 'transaction.created', fromBeginning: true });
  await consumer.run({
    eachMessage: async ({ message }) => {
      let payload;
      try { payload = JSON.parse(message.value.toString()); } catch (_) { return; }
      const status = payload.value > 1000 ? 'rejected' : 'approved';
      const response = { transactionExternalId: payload.transactionExternalId, status };
      await producer.send({ topic: 'transaction.status', messages: [{ value: JSON.stringify(response) }] });
    }
  });
}
if (require.main === module) run().catch(e => { console.error(e); process.exit(1); });
module.exports = { run };
