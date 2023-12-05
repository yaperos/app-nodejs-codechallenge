const { Kafka } = require("kafkajs");
const {
  MESSAGE_SUCCESS_KAFKA_PRODUCER,
  MESSAGE_ERROR_KAFKA_PRODUCER,
} = require("../utils/constants.util");
require("dotenv").config();

const KAFKA_BROKER = process.env.KAFKA_BROKER;
const KAFKA_APP_NAME = process.env.KAFKA_APP_NAME;
const KAFKA_TOPIC_EVENT = process.env.KAFKA_TOPIC_EVENT;

const kafka = new Kafka({
  clientId: KAFKA_APP_NAME,
  brokers: [KAFKA_BROKER],
});

const producer = kafka.producer();

const sendKafkaEvent = async (transactionId, status, value) => {
  try {
    await producer.connect();
    await producer.send({
      topic: KAFKA_TOPIC_EVENT,
      messages: [
        {
          key: transactionId,
          value: JSON.stringify({ transactionId, status, value }),
        },
      ],
    });

    console.log(MESSAGE_SUCCESS_KAFKA_PRODUCER);
  } catch (error) {
    console.error(MESSAGE_ERROR_KAFKA_PRODUCER, error);
  } finally {
    await producer.disconnect();
  }
};

module.exports = sendKafkaEvent;
