import type { Env } from "../config/env";

export type KafkaTopics = {
  transactionCreated: string;
  transactionStatus: string;
};

export const getKafkaTopics = (env: Env): KafkaTopics => ({
  transactionCreated: env.KAFKA_TRANSACTION_TOPIC,
  transactionStatus: env.KAFKA_STATUS_TOPIC
});
