import { env } from "./config/env";
import { logger } from "./config/logger";
import { getKafkaClient } from "./messaging/kafka.client";
import { getKafkaTopics } from "./messaging/kafka.topics";

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
