import { EachMessageHandler, Kafka, Partitioners } from "kafkajs";
import { configurationString, configureGacefullyShutdown } from "libs/src";

export const kafka = new Kafka({
  clientId: configurationString(process.env.KAFKA_CLIENT_ID),
  brokers: [configurationString(process.env.KAFKA_BROKER)],
  retry: {
    initialRetryTime: 100,
    retries: 8,
  },
});

export const consumer = kafka.consumer({
  groupId: "transaction",
});
export const producer = kafka.producer({
  createPartitioner: Partitioners.DefaultPartitioner,
});

export const ensureTopic = async (topic: string) => {
  const admin = kafka.admin();
  await admin.connect();

  const topics = await admin.listTopics();

  if (!topics.includes(topic)) {
    await admin.createTopics({ topics: [{ topic }] });
  }

  await admin.disconnect();
};

export const startKafkaConsumer = async (handler: EachMessageHandler) => {
  await ensureTopic("antifraud.transaction.update.done");

  await consumer.connect();
  await consumer.subscribe({
    topic: "antifraud.transaction.update.done",
    fromBeginning: false,
  });

  configureGacefullyShutdown(consumer);

  await consumer.run({
    eachMessage: handler,
  });
};
