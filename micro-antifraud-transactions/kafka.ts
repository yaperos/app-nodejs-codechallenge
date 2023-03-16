import { Kafka, Partitioners } from "kafkajs";
import * as dotenv from "dotenv";

dotenv.config();

export const kafka = new Kafka({
  clientId: `${process.env.KAFKA_APP_ID}`,
  brokers: ["localhost:9092"],
});

export const consumer = kafka.consumer({
  sessionTimeout: 30000,
  groupId: `${process.env.KAFKA_ANTIFRAUD_GROUP_ID}`,
});

export const kafka_status = new Kafka({
  clientId: `${process.env.KAFKA_STATUS_APP_ID}`,
  brokers: ["localhost:9092"],
});

export const producer_status = kafka_status.producer({
  transactionTimeout: 5000,
  createPartitioner: Partitioners.LegacyPartitioner,
});
