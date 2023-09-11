import { Kafka } from 'kafkajs';
import { config } from './configuration';

export const kafka = new Kafka({
  clientId: config.APP_NAME,
  brokers: [config.KAFKA_HOST],
});

export const consumer = kafka.consumer({ groupId: config.APP_NAME });
