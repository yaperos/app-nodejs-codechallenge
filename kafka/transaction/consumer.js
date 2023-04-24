const { Kafka } = require('kafkajs');
const axios = require('axios');
const tcpPortUsed = require('tcp-port-used');

const { TRANSACTION_STATUSES, BROKER } = require('../../utils/constants');

console.log(`CLIENT_ID >>>`,process.env.CLIENT_ID);
console.log(`TOPIC >>>`,process.env.TOPIC);

const kafka = new Kafka({
  clientId: process.env.CLIENT_ID,
  brokers: [BROKER]
});

const consumer = kafka.consumer({ groupId: process.env.GROUP_ID });

const antiFraud = async () => {
  
  let connected = false;
  while (!connected) {
    try {
      await consumer.connect();
      connected = true;
      console.log('Connected to Kafka broker');
    } catch (err) {
      console.error(`Failed to connect to Kafka broker: ${err.message}`);
      console.log('Retrying in 5 seconds...');
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }

  await consumer.subscribe({ topic: process.env.TOPIC, fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {

      const transaction = JSON.parse( message.value.toString())
      console.log(`transaction >>> ${transaction}`);

      const data = {
        transactionExternalId: transaction.transactionExternalId,
        transactionStatusId: TRANSACTION_STATUSES.approved
      }

      if(parseFloat(transaction.value) > 1000) {
        data.transactionStatusId = TRANSACTION_STATUSES.rejected
      }

      const response  = await axios.post(`${process.env.HOST}/transaction/update-status`, data);
      console.log(`response >>> ${response}`)
    },
  });
};

module.exports = {
  antiFraud
}