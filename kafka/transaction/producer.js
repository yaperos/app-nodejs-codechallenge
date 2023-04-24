const { Kafka } = require('kafkajs');
const { BROKER } = require('../../utils/constants');

const sendTransaction = async (transaction) => {

  console.log(`CLIENT_ID >>>`,process.env.CLIENT_ID);
  console.log(`TOPIC >>>`,process.env.TOPIC);

  const kafka = new Kafka({
    clientId: process.env.CLIENT_ID,
    brokers: [BROKER]
  });
  
  const producer = kafka.producer();
  
  await producer.connect();
  
  await producer.send({
    topic: process.env.TOPIC,
    messages: [
      { key: 'transaction', value: JSON.stringify(transaction) }
    ]
  });
}

module.exports = {
	sendTransaction
}
