import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { Producer } from 'kafkajs';
import { KafkaFactory } from './kafka.factory';
import { SchemaRegistryService } from './schema-registry.service';
import { TRANSACTIONS_STATUS_CHANGED_TOPIC } from './constants';
import { EventPublisher } from '@ports/out/event-publisher';
import { TransactionStatusChangedEvent } from '@domain/events';

@Injectable()
export class StatusEventPublisher
  implements EventPublisher, OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(StatusEventPublisher.name);
  private producer!: Producer;

  constructor(
    private readonly kafkaFactory: KafkaFactory,
    private readonly schemaRegistry: SchemaRegistryService,
  ) {}

  async onModuleInit(): Promise<void> {
    this.producer = this.kafkaFactory.createProducer();
    await this.producer.connect();
    this.logger.log('Kafka producer connected');
  }

  async onModuleDestroy(): Promise<void> {
    if (this.producer) {
      await this.producer.disconnect();
    }
  }

  async publishStatusChanged(event: TransactionStatusChangedEvent): Promise<void> {
    const payload = {
      transactionExternalId: event.transactionExternalId,
      status: event.status,
      reason: event.reason ?? null,
      evaluatedAt: event.evaluatedAt.getTime(),
    };

    const value = await this.schemaRegistry.encode(
      TRANSACTIONS_STATUS_CHANGED_TOPIC,
      payload,
    );

    await this.producer.send({
      topic: TRANSACTIONS_STATUS_CHANGED_TOPIC,
      messages: [{ key: event.transactionExternalId, value }],
    });

    this.logger.debug(
      `Published status change for transaction ${event.transactionExternalId}`,
    );
  }
}
