import { Kafka } from 'kafkajs';
import { config } from './configuration';

export const kafka = new Kafka({
  clientId: config.APP_NAME,
  brokers: [config.KAFKA_HOST],
});

export const producer = kafka.producer();
producer.connect();
