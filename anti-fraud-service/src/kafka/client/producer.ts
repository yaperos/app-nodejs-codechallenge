import { Kafka } from 'kafkajs';
import { kafkaConfig } from '../kafkaConfig';
import { TransactionStatusEvent } from '../../messages/transactionMessages';

const kafka = new Kafka(kafkaConfig);
export const producer = kafka.producer();

export async function sendStatusEvent(event: TransactionStatusEvent) {
  await producer.connect();
  await producer.send({
    topic: 'transaction_status',
    messages: [
      { value: JSON.stringify(event) }
    ]
  });
  await producer.disconnect();
}
