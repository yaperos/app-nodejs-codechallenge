import { EachMessageHandler, Kafka, Partitioners } from "kafkajs";
import { configurationString, configureGacefullyShutdown } from "libs/src";

export const kafka = new Kafka({
  clientId: configurationString(process.env.KAFKA_CLIENT_ID),
  brokers: [configurationString(process.env.KAFKA_BROKER)],
});

export const consumer = kafka.consumer({
  groupId: "antifraud",
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
  await ensureTopic("transaction.create.done");

  await consumer.connect();
  await consumer.subscribe({
    topic: "transaction.create.done",
    fromBeginning: false,
  });

  configureGacefullyShutdown(consumer);

  await consumer.run({
    eachMessage: handler,
  });
};
