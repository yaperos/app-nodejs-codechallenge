import { kafka } from './kafka.client';

const consumer = kafka.consumer({ groupId: 'antifraud-group' });
const producer = kafka.producer();

export async function startAntifraudConsumer() {
  await consumer.connect();
  await producer.connect();

  await consumer.subscribe({
    topic: 'transaction.created',
    fromBeginning: false,
  });

  await consumer.run({
    eachMessage: async ({ message }) => {
      if (!message.value) return;

      const payload = JSON.parse(message.value.toString());

      const status =
        payload.value > 1000 ? 'rejected' : 'approved';

      await producer.send({
        topic: 'transaction.validated',
        messages: [
          {
            key: payload.transactionExternalId,
            value: JSON.stringify({
              transactionExternalId: payload.transactionExternalId,
              status,
            }),
          },
        ],
      });
    },
  });
}