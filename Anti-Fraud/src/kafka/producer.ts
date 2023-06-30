import { Kafka } from 'kafkajs';
import { Transaction } from '../models/transaction.model.js';

const kafka = new Kafka({
  clientId: 'anti-fraud-microservice',
  brokers: ['kafka:9092'],
});

const producer = kafka.producer();

export const sendTransactionStatusEvent = async (transaction: Transaction) => {
  await producer.connect();
  await producer.send({
    topic: 'transaction-status-update',
    messages: [
      { value: JSON.stringify(transaction) },
    ],
  });
  await producer.disconnect();
};
