const {Kafka, Partitioners} = require('kafkajs');

const KAFKA_BROKER = process.env.KAFKA_BROKER;
const KAFKA_CLIENT_ID = process.env.APP_NAME || "NONAME";
const kafkaServer = new Kafka({
  clientId: KAFKA_CLIENT_ID,
  brokers: [KAFKA_BROKER]
});

const producer = kafkaServer.producer({createPartitioner: Partitioners.LegacyPartitioner});

const produceMessage = async (topic, message) => {
  const jsonMessage = JSON.stringify(message);
  await producer.connect();
  await producer.send({
    topic: topic,
    messages: [
      { value: jsonMessage },
    ],
  });
  console.log('KAFKA Topics', topic);
  console.log('KAFKA Produce ', jsonMessage);
  await producer.disconnect();
};

const consumer = kafkaServer.consumer({ groupId: KAFKA_CLIENT_ID });

const consumeMessage = async (topic, callback) => {
  await consumer.connect();
  // const topic = (typeof(aTopic) === 'string')?aTopic:aTopic[0];
  // const topics = (typeof(aTopic) === 'string')?[aTopic]:aTopic;
  if (Array.isArray(topic)) {
    topic.forEach((el) => consumer.subscribe({el, topics: topic, fromBeginning: true}));
  } else {
    consumer.subscribe({topic, topics: [topic], fromBeginning: true});
  }
  // await consumer.subscribe({ topic: topic, topics: [topic], fromBeginning: true });
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const payload = JSON.parse(message.value.toString());
      console.log('KAFKA Topics', topic);
      console.log('KAFKA Consume ', payload);
      callback(payload);
    },
  });
};

module.exports = {produceMessage, consumeMessage};
