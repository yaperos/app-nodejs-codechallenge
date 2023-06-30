import { Kafka } from 'kafkajs';
import { validateTransaction } from '../controllers/antiFraud.controller.js';

const kafka = new Kafka({
  clientId: 'anti-fraud-microservice',
  brokers: ['localhost:9092'],
});

const consumer = kafka.consumer({ groupId: 'anti-fraud-group' });

export const initConsumer = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: 'transaction-created', fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ message }) => {
      const transaction = JSON.parse(message.value?.toString() || '');
      console.log('TRANSACTION -->', transaction);
      await validateTransaction(transaction);
    },
  });
};
