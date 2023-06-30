import { Kafka } from 'kafkajs';
import { Transaction } from '../models/transaction.model.js';

const kafka = new Kafka({
  clientId: 'transactions-microservice',
  brokers: ['localhost:9092'],
});

const producer = kafka.producer();

export const sendTransactionCreatedEvent = async (transaction: Transaction) => {
  await producer.connect();
  await producer.send({
    topic: 'transaction-created',
    messages: [
      { value: JSON.stringify(transaction) },
    ],
  });
  await producer.disconnect();
};
