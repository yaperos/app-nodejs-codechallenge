import { kafka } from './kafka.client';

const producer = kafka.producer();

export async function sendTransactionCreated(event: any) {
  await producer.connect();

  await producer.send({
    topic: 'transaction.created',
    messages: [
      {
        key: event.transactionExternalId,
        value: JSON.stringify(event),
      },
    ],
  });

  await producer.disconnect();
}