import { Kafka, KafkaConfig } from 'kafkajs';

const kafkaConfig: KafkaConfig = {
  clientId: 'transaction-service',
  brokers: ['kafka:9092'], // array de brokers de Kafka
};

const kafka = new Kafka(kafkaConfig);
const producer = kafka.producer();
const consumer = kafka.consumer({ groupId: "transaction-group" });

export { kafka, producer, consumer };
