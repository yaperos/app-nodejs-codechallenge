import type { Kafka, Consumer, EachMessagePayload } from "kafkajs";
import type { Logger } from "pino";

export type KafkaConsumerConfig = {
  groupId: string;
  topics: string[];
  handler: (payload: EachMessagePayload) => Promise<void>;
  logger?: Logger;
};

export const createKafkaConsumer = async (
  kafka: Kafka,
  config: KafkaConsumerConfig
): Promise<Consumer> => {
  const consumer = kafka.consumer({ groupId: config.groupId });
  await consumer.connect();

  for (const topic of config.topics) {
    await consumer.subscribe({ topic, fromBeginning: false });
  }

  await consumer.run({
    eachMessage: async (payload) => {
      try {
        await config.handler(payload);
      } catch (error) {
        config.logger?.error({ err: error }, "kafka consumer handler failed");
        throw error;
      }
    }
  });

  return consumer;
};

export const disconnectKafkaConsumer = async (consumer?: Consumer) => {
  if (consumer) {
    await consumer.disconnect();
  }
};
