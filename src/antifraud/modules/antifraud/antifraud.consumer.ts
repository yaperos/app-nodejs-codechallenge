import type { Kafka } from "kafkajs";
import type { Logger } from "pino";
import { evaluateTransaction } from "./antifraud.processor";
import { parseTransactionCreatedEvent } from "./antifraud.validation";
import { createKafkaConsumer } from "../../messaging/kafka.consumer";
import { sendKafkaMessage } from "../../messaging/kafka.producer";
import { getKafkaTopics } from "../../messaging/kafka.topics";
import type { TransactionCreatedEvent } from "../../messaging/events";
import type { Env } from "../../config/env";

export type AntifraudConsumerDeps = {
  kafka: Kafka;
  env: Env;
  logger: Logger;
};

export const startAntifraudConsumer = async ({
  kafka,
  env,
  logger
}: AntifraudConsumerDeps) => {
  const topics = getKafkaTopics(env);

  return createKafkaConsumer(kafka, {
    groupId: env.KAFKA_CONSUMER_GROUP_ANTIFRAUD,
    topics: [topics.transactionCreated],
    logger,
    handler: async ({ message }) => {
      if (!message.value) {
        logger.warn("received empty kafka message");
        return;
      }

      let decoded: unknown;
      try {
        decoded = JSON.parse(message.value.toString());
      } catch (error) {
        logger.warn({ err: error }, "failed to parse transaction.created payload");
        return;
      }

      const validation = parseTransactionCreatedEvent(decoded);
      if (!validation.success) {
        logger.warn(
          {
            issues: validation.error.issues.map((issue) => ({
              path: issue.path.join("."),
              message: issue.message
            }))
          },
          "invalid transaction.created payload received"
        );
        return;
      }

      const payload = validation.data as TransactionCreatedEvent;
      const statusEvent = evaluateTransaction(payload);

      await sendKafkaMessage(
        kafka,
        {
          topic: topics.transactionStatus,
          messages: [
            {
              key: payload.transactionExternalId,
              value: JSON.stringify(statusEvent)
            }
          ]
        },
        logger
      );
    }
  });
};
