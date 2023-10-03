import { Kafka, KafkaConfig } from 'kafkajs';

const kafkaConfig: KafkaConfig = {
  clientId: '',
  brokers: [],
};

export const kafka = new Kafka(kafkaConfig);
