import { Kafka } from 'kafkajs';
import { kafkaConfig } from '../kafkaConfig';
import { TransactionCreatedEvent } from '../../messages/transactionMessages';

const kafka = new Kafka(kafkaConfig);
export const consumer = kafka.consumer({ groupId: 'anti-fraud-group' });

export async function startConsumer(onMessage: (event: TransactionCreatedEvent) => Promise<void>) {
  await consumer.connect();
  await consumer.subscribe({ topic: 'transaction_created', fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ message }) => {
      if (message.value) {
        const event: TransactionCreatedEvent = JSON.parse(message.value.toString());
        await onMessage(event);
      }
    },
  });
}
