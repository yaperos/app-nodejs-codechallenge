import { Kafka } from 'kafkajs';

export const kafka = new Kafka({
  clientId: 'antifraud-service',
  brokers: ['kafka:29092'],
});
