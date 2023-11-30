import { Kafka, KafkaConfig } from 'kafkajs';

const kafkaConfig: KafkaConfig = {
  clientId: 'antiFraud-service',
  brokers: ['kafka:9092']
};

const kafka = new Kafka(kafkaConfig);
const producer = kafka.producer();
const consumer = kafka.consumer({ groupId: "antiFraud-group" });

export { kafka, producer, consumer };
