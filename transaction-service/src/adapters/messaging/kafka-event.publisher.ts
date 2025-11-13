import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { Producer } from 'kafkajs';
import { KafkaFactory } from './kafka.factory';
import { SchemaRegistryService } from './schema-registry.service';
import {
  TRANSACTIONS_STATUS_CHANGED_TOPIC,
  AvroTopic,
  isAvroTopic,
} from './constants';
import { EventPublisher } from '@ports/out/event-publisher';
import { JsonValue, OutboxMessage } from '@domain/outbox';
import { TransactionStatusChangedEvent } from '@domain/transaction';

@Injectable()
export class KafkaEventPublisher
  implements EventPublisher, OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(KafkaEventPublisher.name);
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

  private toRecord(v: JsonValue): Record<string, unknown> {
    if (v && typeof v === 'object' && !Array.isArray(v)) {
      return v as Record<string, unknown>;
    }
    // wrap primitives/arrays/null
    return { value: v };
  }

  private async send(topic: AvroTopic, key: string, payload: Record<string, unknown>) {
    const encoded = await this.schemaRegistry.encode(topic, payload);
    await this.producer.send({
      topic,
      messages: [{ key, value: encoded }],
    });
  }

  async publishOutboxMessage(message: OutboxMessage): Promise<void> {
    if (!message.id) {
      throw new Error('Outbox message must have an id before publishing');
    }

    if (!isAvroTopic(message.topic)) {
      throw new Error(`Topic ${message.topic} is not mapped to an Avro schema`);
    }

    await this.send(message.topic, message.key, this.toRecord(message.payload));
    this.logger.debug(`Published message ${message.id} to ${message.topic}`);
  }

  async publishTransactionStatusChanged(
    event: TransactionStatusChangedEvent,
  ): Promise<void> {
    const payload = {
      transactionExternalId: event.transactionExternalId,
      status: event.status,
      reason: event.reason ?? null,
      evaluatedAt: event.evaluatedAt.getTime(),
    };

    await this.send(TRANSACTIONS_STATUS_CHANGED_TOPIC, event.transactionExternalId, payload);
  }
}
