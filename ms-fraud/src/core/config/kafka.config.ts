import { Kafka, KafkaConfig } from 'kafkajs';

const kafkaConfig: KafkaConfig = {
  clientId: process.env.KAFKA_CLIENT_ID || 'TRANSACTION_CLIENT',
  brokers: [process.env.KAFKA_HOST || 'localhost:9092'],
};

export const kafka = new Kafka(kafkaConfig);
