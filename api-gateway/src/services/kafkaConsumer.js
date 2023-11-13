const { Kafka } = require('kafkajs');
const EventEmitter = require('events');
class KafkaConsumerEmitter extends EventEmitter {}
const kafkaConsumerEmitter = new KafkaConsumerEmitter();
require('dotenv').config()
const kafka = new Kafka({
  clientId: process.env.CLIENT_ID,
  brokers: [process.env.BROKER]
});

const consumer = kafka.consumer({ groupId: process.env.GROUP_ID });

const run = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: 'transaction-update', fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const transactionUpdate = JSON.parse(message.value.toString());
      kafkaConsumerEmitter.emit('transactionUpdate', transactionUpdate);
    },
  });
};

run().catch(console.error);

module.exports = { run, kafkaConsumerEmitter };
