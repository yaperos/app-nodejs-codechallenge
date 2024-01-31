const { Kafka, Consumer } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'my-consumer',
  brokers: ['localhost:9092'],
});

const consumer = kafka.consumer({ groupId: 'my-group' });

const runConsumer = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: 'transaction-emitter', fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log({
        value: message.value.toString(),
        offset: message.offset,
      });
    },
  });
};

runConsumer().catch(console.error);
