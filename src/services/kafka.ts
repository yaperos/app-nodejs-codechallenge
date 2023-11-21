import { Kafka } from "kafkajs";
import { AppDataSource } from "../config/database";
import { Transaction } from "../models/transaction";
import { logger } from "../config/logger";

const kafka = new Kafka({
  clientId: "yape",
  brokers: ["kafka:29092"],
});

// envia mensajes a los topics
export const producer = kafka.producer();

// consumer lee mensajes de un topic
const consumer = kafka.consumer({ groupId: "transaction-group" });

export const startConsumer = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: "send-transaction", fromBeginning: true });

  // Inicia procesamiento de mensajes
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      if (!message.value) {
        logger.error("Received a message with no value.");
        return;
      }

      const transactionData = JSON.parse(message.value.toString());
      const transactionRepository = AppDataSource.getRepository(Transaction);

      const transaction = await transactionRepository.findOneBy({ id: transactionData.transactionId });
      if (transaction) {
        transaction.status = transactionData.value > 1000 ? 'REJECTED' : 'APPROVED';
        await transactionRepository.save(transaction);
      }
    },
  });
};
