const { Kafka } = require("kafkajs");
const clientId = process.env.CLIENT_ID;
const brokers = [process.env.BROKER];
const producer_topic = process.env.PRODUCER_TOPIC;
const consumer_topic = process.env.CONSUMER_TOPIC;
const kafka = new Kafka({ clientId, brokers });

const producer = kafka.producer();
const consumer = kafka.consumer({ groupId: clientId });

const produce = async (id, data) => {
  await producer.connect();
  await producer.send({
    topic: producer_topic,
    messages: [
      {
        key: id,
        value: JSON.stringify(data),
      },
    ],
  });
  await producer.disconnect();
};

const consume = async (fnMethod) => {
  // first, we wait for the client to connect and subscribe to the given topic
  await consumer.connect();
  await consumer.subscribe({ topic: consumer_topic });
  await consumer.run({
    // this function is called every time the consumer gets a new message
    eachMessage: async ({ message }) => {
      // here, we just log the message to the standard output
      await fnMethod(message.key.toString(), message.value.toString())
    },
  });
};

module.exports = {
  produce,
  producer,
  consume,
  consumer
};
