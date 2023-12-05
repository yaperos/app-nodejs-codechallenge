const { Kafka } = require("kafkajs");
require("dotenv").config();
const { updateTransaction } = require("../controllers/transaction.controller");
const {
  STATUS_TRANSACTION,
  TYPE_TRANSACTION,
} = require("../models/enums/statusTransaction.enum");
const { MESSAGE_ERROR_KAFKA_CONSUMER } = require("../utils/constants.util");

const KAFKA_BROKER = process.env.KAFKA_BROKER;
const KAFKA_APP_NAME = process.env.KAFKA_APP_NAME;
const KAFKA_GROUP_ID = process.env.KAFKA_GROUP_ID;
const KAFKA_TOPIC_EVENT = process.env.KAFKA_TOPIC_EVENT;

const kafka = new Kafka({
  clientId: KAFKA_APP_NAME,
  brokers: [KAFKA_BROKER],
});

const consumer = kafka.consumer({ groupId: KAFKA_GROUP_ID });

const listenToKafkaEvents = async () => {
  try {
    await consumer.connect();
    await consumer.subscribe({ topic: KAFKA_TOPIC_EVENT });

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        setTimeout(async () => {
          const key = message.key.toString();
          const value = JSON.parse(message.value.toString());
          const transactionType = { name: TYPE_TRANSACTION[1] };

          if (value.value > 1000) {
            value.status = STATUS_TRANSACTION.REJECTED;
            transactionType.name = TYPE_TRANSACTION[3];
          } else {
            value.status = STATUS_TRANSACTION.APPROVED;
            transactionType.name = TYPE_TRANSACTION[2];
          }

          await updateTransaction(key, value.status, transactionType);
        }, 5000);
      },
    });
  } catch (error) {
    console.error(MESSAGE_ERROR_KAFKA_CONSUMER, error);
  }
};

module.exports = listenToKafkaEvents;
