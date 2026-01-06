import { kafka } from './kafka.client';
import { PrismaService } from '../prisma.service';

const consumer = kafka.consumer({ groupId: 'transaction-group' });

export async function startTransactionStatusConsumer(
  prisma: PrismaService,
) {
  await consumer.connect();

  await consumer.subscribe({
    topic: 'transaction.validated',
    fromBeginning: false,
  });

  await consumer.run({
    eachMessage: async ({ message }) => {
      const payload = JSON.parse(message.value!.toString());

      await prisma.transaction.update({
        where: {
          transactionExternalId: payload.transactionExternalId,
        },
        data: {
          status: payload.status,
        },
      });
    },
  });
}