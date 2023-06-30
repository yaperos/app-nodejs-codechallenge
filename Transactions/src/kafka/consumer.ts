import { Kafka } from 'kafkajs';
import { DataSource } from 'typeorm';
import { updateTransactionStatus } from '../controllers/transaction.controller.js';

const kafka = new Kafka({
  clientId: 'transaction-microservice',
  brokers: ['kafka:9092'],
});

const consumer = kafka.consumer({ groupId: 'transaction-group' });

export const initConsumer = async (dataSource: DataSource) => {
  await consumer.connect();
  await consumer.subscribe({ topic: 'transaction-status-update', fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ message }) => {
      const transaction = JSON.parse(message.value?.toString() || '');
      console.log('---->', transaction);
      const status = transaction.transactionStatus;
      await updateTransactionStatus(transaction, status, dataSource);
    },
  });
};
