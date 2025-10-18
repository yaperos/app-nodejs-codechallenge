import type { Kafka } from "kafkajs";
import type { Logger } from "pino";
import { evaluateTransaction } from "./antifraud.processor.js";
import { createKafkaConsumer } from "../../messaging/kafka.consumer.js";
import { sendKafkaMessage } from "../../messaging/kafka.producer.js";
import { getKafkaTopics } from "../../messaging/kafka.topics.js";
import type { TransactionCreatedEvent } from "../../messaging/events.js";
import type { Env } from "../../config/env.js";

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

      const payload = JSON.parse(message.value.toString()) as TransactionCreatedEvent;
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
