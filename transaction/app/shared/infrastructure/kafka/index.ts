import { Kafka } from "kafkajs";

export const createKafka = (): Kafka =>
  new Kafka({ clientId: "test-app", brokers: ["0.0.0.0:9092"] });

export const producer = createKafka().producer();

export const consumer = createKafka().consumer({ groupId: "test-group" });
