import { env } from "./config/env.js";
import { logger } from "./config/logger.js";
import { getKafkaClient } from "./messaging/kafka.client.js";
import { getKafkaTopics } from "./messaging/kafka.topics.js";

const kafka = getKafkaClient({
  clientId: `${env.KAFKA_CLIENT_ID}-antifraud`,
  brokers: env.KAFKA_BROKERS
});

const topics = getKafkaTopics(env);
const serviceLogger = logger.child({ service: "antifraud" });

export const antifraudContainer = {
  env,
  logger: serviceLogger,
  kafka,
  topics
};

type AntifraudContainer = typeof antifraudContainer;
export type AntifraudContainerEnv = AntifraudContainer["env"];
export type AntifraudContainerLogger = AntifraudContainer["logger"];
export type AntifraudContainerKafka = AntifraudContainer["kafka"];
export type AntifraudContainerTopics = AntifraudContainer["topics"];
