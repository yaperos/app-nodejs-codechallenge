const { Kafka } = require("kafkajs");
require("dotenv").config();

const KAFKA_BROKER = process.env.KAFKA_BROKER;
const KAFKA_APP_NAME = process.env.KAFKA_APP_NAME;

const kafka = new Kafka({
  clientId: KAFKA_APP_NAME,
  brokers: [KAFKA_BROKER],
});

const producer = kafka.producer();

const sendKafkaEvent = async (transactionId, status) => {
  try {
    await producer.connect();
    await producer.send({
      topic: "transaction-events",
      messages: [
        {
          key: transactionId,
          value: JSON.stringify({ transactionId, status }),
        },
      ],
    });
  } catch (error) {
    console.error("Error sending Kafka event:", error);
  } finally {
    await producer.disconnect();
  }
};

module.exports = sendKafkaEvent;
