import { Kafka } from "kafkajs";
import { AppDataSource } from "../config/database";
import { Transaction } from "../models/transaction";
import { logger } from "../config/logger";
import { validateTransaction } from "../utils/validateTransaction";

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
  await consumer.subscribe({ topic: "send-transactions", fromBeginning: true });
  await consumer.subscribe({ topic: "status-updates", fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      if (!message.value) {
        logger.error("Received a message with no value.");
        return;
      }

      try {
        const data = JSON.parse(message.value.toString());

        if (topic === "send-transactions") {
          processNewTransaction(data as TransactionData);
        } else if (topic === "status-updates") {
          processStatusUpdate(data);
        }
      } catch (error) {
        logger.error("Error processing Kafka message", error);
      }
    },
  });
};

export interface TransactionData {
  accountExternalIdDebit: string;
  accountExternalIdCredit: string;
  transferTypeId: number;
  value: number;
}

const processNewTransaction = async (transactionData: TransactionData) => {
  try {
    const transactionRepository = AppDataSource.getRepository(Transaction);
    const newTransaction = new Transaction();

    newTransaction.accountExternalIdDebit =
      transactionData.accountExternalIdDebit;
    newTransaction.accountExternalIdCredit =
      transactionData.accountExternalIdCredit;
    newTransaction.transferTypeId = transactionData.transferTypeId;
    newTransaction.value = transactionData.value;
    newTransaction.status = "PENDING";

    await transactionRepository.save(newTransaction);
    logger.info(`New transaction saved: ${newTransaction.id}`);

    validateTransaction(transactionData, newTransaction.id);
  } catch (error) {
    logger.error("Error processing new transaction", error);
  }
};

interface StatusUpdateData {
  transactionExternalId: string;
  newStatus: "PENDING" | "APPROVED" | "REJECTED";
}

const processStatusUpdate = async (statusData: StatusUpdateData) => {
  try {
    const transactionRepository = AppDataSource.getRepository(Transaction);
    const transaction = await transactionRepository.findOneBy({
      id: statusData.transactionExternalId,
    });

    if (transaction) {
      if (transaction.status === "PENDING") {
        transaction.status = statusData.newStatus;
        await transactionRepository.save(transaction);
        logger.info(`Transaction updated: ${transaction.id}`);
      } else {
        logger.warn(
          `Transaction status not updated (not in pending state): ${transaction.id}`
        );
      }
    } else {
      logger.warn(`Transaction not found: ${statusData.transactionExternalId}`);
    }
  } catch (error) {
    logger.error("Error updating transaction status", error);
  }
};


export const sendStatusUpdate = async (transactionId: string, newStatus: string) => {
  const message = {
    transactionExternalId: transactionId,
    newStatus: newStatus,
  };

  await producer.send({
    topic: "status-updates",
    messages: [{ value: JSON.stringify(message) }],
  });

  logger.info(`Sent status update for transaction ${transactionId}: ${newStatus}`);
};

