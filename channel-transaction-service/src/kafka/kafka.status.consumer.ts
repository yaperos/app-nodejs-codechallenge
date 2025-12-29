import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { Kafka } from 'kafkajs';
import { PrismaService } from '../prisma/prisma.service';

type StatusUpdatedEvent = {
  eventId: string;
  occurredAt: string;
  transactionExternalId: string;
  status: 'approved' | 'rejected';
};

const TOPIC_STATUS_UPDATED = 'transaction.status-updated';

@Injectable()
export class KafkaStatusConsumer implements OnModuleInit {
  private readonly logger = new Logger(KafkaStatusConsumer.name);

  private consumer = new Kafka({
    clientId: 'transaction-service-consumer',
    brokers: (process.env.KAFKA_BROKERS ?? 'localhost:9092').split(','),
  }).consumer({ groupId: 'transaction-service' });

  constructor(private prisma: PrismaService) {}

  async onModuleInit() {
    await this.consumer.connect();
    await this.consumer.subscribe({ topic: TOPIC_STATUS_UPDATED, fromBeginning: false });

    await this.consumer.run({
      eachMessage: async ({ message }) => {
        if (!message.value) return;
        const evt = JSON.parse(message.value.toString()) as StatusUpdatedEvent;

        // idempotencia: solo cambia si sigue pending
        const res = await this.prisma.transaction.updateMany({
          where: { transactionExternalId: evt.transactionExternalId, status: 'pending' },
          data: { status: evt.status },
        });

        this.logger.log(
          `status-updated tx=${evt.transactionExternalId} -> ${evt.status} (updated=${res.count})`,
        );
      },
    });
  }
}
