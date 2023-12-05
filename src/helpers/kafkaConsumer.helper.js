const { Kafka } = require("kafkajs");
require("dotenv").config();
const { updateTransaction } = require("../controllers/transaction.controller");

const KAFKA_BROKER = process.env.KAFKA_BROKER;
const KAFKA_APP_NAME = process.env.KAFKA_APP_NAME;

const kafka = new Kafka({
  clientId: KAFKA_APP_NAME,
  brokers: [KAFKA_BROKER],
});

const consumer = kafka.consumer({ groupId: "transaction-consumer-group" });

const listenToKafkaEvents = async () => {
  try {
    await consumer.connect();
    await consumer.subscribe({ topic: "transaction-events" });

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        setTimeout(async () => {
          const key = message.key.toString();
          const value = JSON.parse(message.value.toString());
          await updateTransaction(key, value.status);
        }, 5000);
      },
    });
  } catch (error) {
    console.error("Error with Kafka consumer:", error);
  }
};

module.exports = listenToKafkaEvents;
