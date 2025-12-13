import { Kafka } from 'kafkajs';
import { kafkaConfig } from '../kafkaConfig';
import { TransactionCreatedEvent } from '../../messages/transactionMessages';

const kafka = new Kafka(kafkaConfig);
export const producer = kafka.producer();

// Productor de Kafka para enviar eventos de transacciones creadas
export async function sendTransactionCreatedEvent(event: TransactionCreatedEvent) {
  await producer.connect();
  await producer.send({
    topic: 'transaction_created',
    messages: [
      { value: JSON.stringify(event) }
    ]
  });
  await producer.disconnect();
}
