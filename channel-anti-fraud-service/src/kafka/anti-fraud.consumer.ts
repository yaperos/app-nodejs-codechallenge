import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Kafka } from 'kafkajs';
import { randomUUID } from 'crypto';
import { TOPICS, TransactionCreatedEvent, TransactionStatusUpdatedEvent } from './topics';

@Injectable()
export class AntiFraudConsumer implements OnModuleInit {
  private readonly logger = new Logger(AntiFraudConsumer.name);

  private kafka = new Kafka({
    clientId: 'anti-fraud-service',
    brokers: (process.env.KAFKA_BROKERS ?? 'localhost:9092').split(','),
  });

  private consumer = this.kafka.consumer({ groupId: 'anti-fraud-service' });
  private producer = this.kafka.producer();

  async onModuleInit() {
    await this.consumer.connect();
    await this.producer.connect();

    await this.consumer.subscribe({ topic: TOPICS.CREATED, fromBeginning: false });

    await this.consumer.run({
      eachMessage: async ({ message }) => {
        if (!message.value) return;

        const evt = JSON.parse(message.value.toString()) as TransactionCreatedEvent;

        const status: TransactionStatusUpdatedEvent['status'] =
          evt.value > 1000 ? 'rejected' : 'approved';

        const out: TransactionStatusUpdatedEvent = {
          eventId: randomUUID(),
          occurredAt: new Date().toISOString(),
          transactionExternalId: evt.transactionExternalId,
          status,
        };

        await this.producer.send({
          topic: TOPICS.STATUS_UPDATED,
          messages: [{ key: evt.transactionExternalId, value: JSON.stringify(out) }],
        });

        this.logger.log(`tx=${evt.transactionExternalId} value=${evt.value} => ${status}`);
      },
    });

    this.logger.log(`Listening topic: ${TOPICS.CREATED}`);
  }
}
