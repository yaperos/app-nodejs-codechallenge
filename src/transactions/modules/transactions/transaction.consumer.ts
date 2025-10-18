import { PrismaClient, TransactionStatusName } from "@prisma/client";
import type { Kafka } from "kafkajs";
import type { Logger } from "pino";
import { createKafkaConsumer } from "../../messaging/kafka.consumer.js";
import { getKafkaTopics } from "../../messaging/kafka.topics.js";
import type { TransactionStatusEvent } from "../../messaging/events.js";
import type { Env } from "../../config/env.js";
import { createTransactionService } from "./transaction.service.js";

const parseStatus = (status: string): TransactionStatusName => {
  if (status === TransactionStatusName.approved) return TransactionStatusName.approved;
  if (status === TransactionStatusName.rejected) return TransactionStatusName.rejected;
  return TransactionStatusName.pending;
};

export type TransactionStatusConsumerDeps = {
  kafka: Kafka;
  env: Env;
  prisma: PrismaClient;
  logger: Logger;
};

export const startTransactionStatusConsumer = async ({
  kafka,
  env,
  prisma,
  logger
}: TransactionStatusConsumerDeps) => {
  const topics = getKafkaTopics(env);
  const service = createTransactionService({
    prisma,
    logger
  });

  return createKafkaConsumer(kafka, {
    groupId: env.KAFKA_CONSUMER_GROUP_TRANSACTIONS,
    topics: [topics.transactionStatus],
    logger,
    handler: async ({ message }) => {
      if (!message.value) {
        logger.warn("received empty status message");
        return;
      }

      const payload = JSON.parse(message.value.toString()) as TransactionStatusEvent;
      const status = parseStatus(payload.status);

      await service.setStatus(payload.transactionExternalId, status);
      logger.info({ transactionExternalId: payload.transactionExternalId, status }, "transaction status updated");
    }
  });
};
