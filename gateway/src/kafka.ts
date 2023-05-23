import type { KafkaEvent } from "@app-nodejs-codechallenge/http-lib";
import type { EventTopic } from "@app-nodejs-codechallenge/shared-lib";
import { Kafka } from "kafkajs";
import fetch from "node-fetch-native";
import { z } from "zod";
import { microservicesConfig } from "./config";

const env = z
  .object({
    KAFKA_BROKERS: z.string(),
    PROXY_HOST: z.string(),
  })
  .parse(process.env);

const kafka = new Kafka({
  clientId: "app-nodejs-codechallenge",
  brokers: env.KAFKA_BROKERS.split(","),
});

const mapTopics = (ms: string): EventTopic[] => [
  `${ms}.create.done`,
  `${ms}.read.done`,
  `${ms}.update.done`,
  `${ms}.delete.done`,
  `${ms}.create.failed`,
  `${ms}.read.failed`,
  `${ms}.update.failed`,
  `${ms}.delete.failed`,
];

export const syncKafkaTopics = async (): Promise<void> => {
  const admin = kafka.admin();
  await admin.connect();
  const adminTopics = await admin.listTopics();
  const topics = adminTopics.filter((topic) => /^(?!__).*/.test(topic));

  const allTopics = Array.from(
    new Set<string>(microservicesConfig.map((ms) => mapTopics(ms.name)).flat())
  );

  const topicsToCreate = allTopics.filter((topic) => !topics.includes(topic));
  if (topicsToCreate.length > 0) {
    console.log("creating topics", topicsToCreate);
    await admin.createTopics({
      topics: topicsToCreate.map((topic) => ({
        topic,
        numPartitions: 1,
        replicationFactor: 1,
      })),
    });
  }

  const topicsToDelete = topics.filter((topic) => !allTopics.includes(topic));
  if (topicsToDelete.length > 0) {
    console.log("deleting topics", topicsToDelete);
    await admin.deleteTopics({
      topics: topicsToDelete,
    });
  }

  await admin.disconnect();
};

export const proxyKafkaEvents = async () => {
  const consumer = kafka.consumer({
    groupId: "gateway",
    rebalanceTimeout: 1000,
  });
  await consumer.connect();
  await consumer.subscribe({
    topics: microservicesConfig
      .map((ms) => ms.inputTopics)
      .filter((topics): topics is string[] => Array.isArray(topics))
      .flat(),
    fromBeginning: false,
  });

  await consumer.run({
    eachMessage: async (payload) => {
      console.log("KAFKA:", payload.message.value?.toString());

      const requests = microservicesConfig.map((config) => {
        if (config.inputTopics?.includes(payload.topic)) {
          const event: KafkaEvent = {
            topic: payload.topic,
            value: payload.message.value?.toString() ?? "",
          };

          return fetch(`http://${env.PROXY_HOST}:${config.port}/`, {
            method: "POST",
            body: JSON.stringify(event),
          });
        }

        return Promise.resolve();
      });

      await Promise.all(requests);
    },
  });
};
