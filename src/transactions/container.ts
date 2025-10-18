import { env } from "./config/env";
import { logger } from "./config/logger";
import { prisma } from "./db/prisma-client";
import { getKafkaClient } from "./messaging/kafka.client";
import { getKafkaTopics } from "./messaging/kafka.topics";

const kafka = getKafkaClient({
  clientId: env.KAFKA_CLIENT_ID,
  brokers: env.KAFKA_BROKERS
});
const topics = getKafkaTopics(env);

export const transactionsContainer = {
  env,
  logger: logger.child({ service: "transactions" }),
  prisma,
  kafka,
  topics
};

type TransactionsContainer = typeof transactionsContainer;
export type TransactionsContainerEnv = TransactionsContainer["env"];
export type TransactionsContainerLogger = TransactionsContainer["logger"];
export type TransactionsContainerKafka = TransactionsContainer["kafka"];
export type TransactionsContainerTopics = TransactionsContainer["topics"];
