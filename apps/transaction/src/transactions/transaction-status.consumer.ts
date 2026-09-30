import {
  deadLetterTopic,
  Topics,
  TransactionStatus,
  type TransactionStatusUpdatedEvent,
} from '@app/contracts';
import { KafkaConsumerService, NonRetriableError } from '@app/messaging';
import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { isUUID } from 'class-validator';
import { TransactionsService } from './transactions.service';

const FINAL_STATUSES: string[] = [
  TransactionStatus.Approved,
  TransactionStatus.Rejected,
];

export function parseStatusUpdated(
  raw: unknown,
): TransactionStatusUpdatedEvent {
  const event = raw as Partial<TransactionStatusUpdatedEvent> | null;
  if (
    !event ||
    !isUUID(event.transactionExternalId) ||
    !FINAL_STATUSES.includes(event.status as string)
  ) {
    throw new NonRetriableError('Invalid TransactionStatusUpdatedEvent');
  }
  return event as TransactionStatusUpdatedEvent;
}

@Injectable()
export class TransactionStatusConsumer implements OnApplicationBootstrap {
  private readonly logger = new Logger(TransactionStatusConsumer.name);

  constructor(
    private readonly consumer: KafkaConsumerService,
    private readonly service: TransactionsService,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    await this.consumer.subscribe({
      groupId: 'transaction-service',
      topic: Topics.TransactionStatusUpdated,
      deadLetterTopic: deadLetterTopic(Topics.TransactionStatusUpdated),
      parse: parseStatusUpdated,
      handle: (event) => this.handle(event),
    });
  }

  async handle(event: TransactionStatusUpdatedEvent): Promise<void> {
    const updated = await this.service.applyStatus(
      event.transactionExternalId,
      event.status,
    );
    if (updated) {
      this.logger.log(`${event.transactionExternalId} → ${event.status}`);
    } else {
      this.logger.warn(
        `${event.transactionExternalId} ignored ${event.status}: not pending (duplicate, late or unknown)`,
      );
    }
  }
}
