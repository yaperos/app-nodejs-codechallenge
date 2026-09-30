import {
  deadLetterTopic,
  Topics,
  type TransactionCreatedEvent,
  type TransactionStatusUpdatedEvent,
} from '@app/contracts';
import {
  KafkaConsumerService,
  KafkaProducerService,
  NonRetriableError,
} from '@app/messaging';
import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { isUUID } from 'class-validator';
import { evaluate, toCents } from './fraud-rule';

export function parseTransactionCreated(raw: unknown): TransactionCreatedEvent {
  const event = raw as Partial<TransactionCreatedEvent> | null;
  if (!event || !isUUID(event.transactionExternalId)) {
    throw new NonRetriableError('Invalid TransactionCreatedEvent');
  }
  try {
    toCents(event.value as string);
  } catch {
    throw new NonRetriableError(`Invalid value: ${String(event.value)}`);
  }
  return event as TransactionCreatedEvent;
}

@Injectable()
export class TransactionCreatedConsumer implements OnApplicationBootstrap {
  private readonly logger = new Logger(TransactionCreatedConsumer.name);

  constructor(
    private readonly consumer: KafkaConsumerService,
    private readonly producer: KafkaProducerService,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    await this.consumer.subscribe({
      groupId: 'anti-fraud-service',
      topic: Topics.TransactionCreated,
      deadLetterTopic: deadLetterTopic(Topics.TransactionCreated),
      parse: parseTransactionCreated,
      handle: (event) => this.handle(event),
    });
  }

  // Sin estado: reprocesar el mismo evento produce el mismo resultado, y el
  // servicio de transacciones ignora los duplicados.
  async handle(event: TransactionCreatedEvent): Promise<void> {
    const result: TransactionStatusUpdatedEvent = {
      transactionExternalId: event.transactionExternalId,
      status: evaluate(event.value),
    };
    await this.producer.send(Topics.TransactionStatusUpdated, [
      { key: result.transactionExternalId, value: JSON.stringify(result) },
    ]);
    this.logger.log(
      `${result.transactionExternalId} value=${event.value} → ${result.status}`,
    );
  }
}
