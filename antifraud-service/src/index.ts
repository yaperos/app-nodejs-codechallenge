import "dotenv/config";
import { Kafka } from "kafkajs";
import axios from "axios";
import logger from "./libs/logger";

const KAFKA_GROUP = "my-group";

const kafka = new Kafka({
  clientId: "my-demo-app",
  brokers: [process.env.KAFKA_HOST],
});

const antiFraudService = {
  isValid: function name(transaction: any) {
    logger.info("Validating transaction", { transaction });
    return transaction.value <= 1000;
  },
};

const processMessage = async ({ message }) => {
  const transaction = JSON.parse(message.value.toString());
  if (antiFraudService.isValid(transaction)) {
    logger.info(`Transaction ${transaction.id} is valid`);
    await axios.put(
      `${process.env.TRANSACTION_API_BASE_URL}/api/internal/transactions/${transaction.id}/approve`
    );
  } else {
    logger.info(`Transaction ${transaction.id} is invalid`);
    await axios.put(
      `${process.env.TRANSACTION_API_BASE_URL}/api/internal/transactions/${transaction.id}/reject`
    );
  }
};

const consumer = kafka.consumer({
  groupId: KAFKA_GROUP,
});

const subscribe = async () => {
  await consumer.connect();
  await consumer.subscribe({
    topic: "transaction-created",
    fromBeginning: true,
  });
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      await processMessage({ message });
      await consumer.commitOffsets([
        { topic, partition, offset: message.offset },
      ]);
    },
  });
};

subscribe();
