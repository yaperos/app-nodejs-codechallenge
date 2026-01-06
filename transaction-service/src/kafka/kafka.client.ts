import { Kafka } from 'kafkajs';

export const kafka = new Kafka({
  clientId: 'transaction-service',
  brokers: ['kafka:29092'],
});
