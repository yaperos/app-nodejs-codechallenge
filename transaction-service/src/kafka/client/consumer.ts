import { Kafka } from 'kafkajs';
import { kafkaConfig } from '../kafkaConfig';
import { TransactionStatusEvent } from '../../messages/transactionMessages';

const kafka = new Kafka(kafkaConfig);
export const consumer = kafka.consumer({ groupId: 'transaction-status-group' });

// Inicia el consumidor de Kafka y procesa mensajes del topic 'transaction_status'.
export async function startConsumer(onMessage: (event: TransactionStatusEvent) => Promise<void>) {
  await consumer.connect();
  await consumer.subscribe({ topic: 'transaction_status', fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ message }) => {
      if (message.value) {
        const event: TransactionStatusEvent = JSON.parse(message.value.toString());
        await onMessage(event);
      }
    },
  });
}
