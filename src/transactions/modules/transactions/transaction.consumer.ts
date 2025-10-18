import { PrismaClient, TransactionStatusName, Prisma } from "@prisma/client";
import type { Kafka } from "kafkajs";
import type { Logger } from "pino";
import { createKafkaConsumer } from "../../messaging/kafka.consumer";
import { getKafkaTopics } from "../../messaging/kafka.topics";
import type { TransactionStatusEvent } from "../../messaging/events";
import type { Env } from "../../config/env";

const parseStatus = (status: string): TransactionStatusName => {
  if (status === TransactionStatusName.approved) return TransactionStatusName.approved;
  if (status === TransactionStatusName.rejected) return TransactionStatusName.rejected;
  return TransactionStatusName.pending;
};

/**
 * Updates transaction status directly in database
 */
const updateTransactionStatus = async (
  prisma: PrismaClient,
  externalId: string,
  status: TransactionStatusName,
  logger: Logger
): Promise<void> => {
  try {
    await prisma.transaction.update({
      where: { externalId },
      data: {
        status: {
          connect: { name: status }
        }
      }
    });
  } catch (error: unknown) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      logger.warn({ externalId }, "transaction not found for status update");
      return;
    }
    throw error;
  }
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

      await updateTransactionStatus(prisma, payload.transactionExternalId, status, logger);
      logger.info({ transactionExternalId: payload.transactionExternalId, status }, "transaction status updated");
    }
  });
};
