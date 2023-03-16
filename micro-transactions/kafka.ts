import { Kafka, Partitioners } from "kafkajs";
import * as dotenv from "dotenv";

dotenv.config();

export const kafka = new Kafka({
  clientId: `${process.env.KAFKA_APP_ID}`,
  brokers: ["localhost:9092"],
});

export const kafka_status = new Kafka({
  clientId: `${process.env.KAFKA_STATUS_APP_ID}`,
  brokers: ["localhost:9092"],
});

export const producer = kafka.producer({
  transactionTimeout: 5000,
  allowAutoTopicCreation: false,
  createPartitioner: Partitioners.LegacyPartitioner,
});

export const consumer = kafka_status.consumer({
  groupId: `${process.env.KAFKA_TRANSACTION_GROUP_ID}`,
});
