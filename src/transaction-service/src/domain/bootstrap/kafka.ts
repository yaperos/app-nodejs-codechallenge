import { config } from "dotenv";
import { Kafka, Partitioners } from "kafkajs";

config();

const kafka = new Kafka({
  clientId: process.env.KAFKA_CLIENT_ID,
  brokers: [
    `${process.env.KAFKA_BROKER_HOST}:${process.env.KAFKA_BROKER_PORT}`,
  ],
});

const consumer = kafka.consumer({ groupId: "yape-2" });
const producer = kafka.producer({
  createPartitioner: Partitioners.LegacyPartitioner,
});

export { consumer, producer };
