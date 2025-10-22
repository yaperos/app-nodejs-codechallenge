import { Injectable, Inject } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { BaseEventService } from '../../common/patterns/event-bus/base-event.service';

@Injectable()
export class TransactionEventService extends BaseEventService {
  constructor(
    @Inject('KAFKA_SERVICE')
    kafkaClient: ClientKafka,
  ) {
    super('TransactionService', kafkaClient, {
      preserveOrder: true,
      maxRetries: 3,
      retryDelay: 1000,
      timeout: 30000,
      enableIdempotency: true,
    });
  }

  protected getAggregateType(): string {
    return 'Transaction';
  }

  async publishTransactionCreated(
    transactionId: string,
    externalId: string,
    type: string,
    amount: number,
    currency: string,
    sourceAccountId: string,
    targetAccountId: string,
    metadata: Record<string, string | number | boolean>,
  ) {
    return this.publishEvent(
      'TransactionCreated',
      transactionId,
      {
        externalId,
        type,
        amount,
        currency,
        sourceAccountId,
        targetAccountId,
        metadata,
      },
      {
        correlationId: externalId,
      },
    );
  }

  async publishTransactionProcessing(transactionId: string) {
    return this.publishEvent(
      'TransactionProcessing',
      transactionId,
      { transactionId },
    );
  }

  async publishTransactionCompleted(
    transactionId: string,
    completedAt: Date,
  ) {
    return this.publishEvent(
      'TransactionCompleted',
      transactionId,
      { completedAt },
    );
  }

  async publishTransactionFailed(
    transactionId: string,
    reason: string,
  ) {
    return this.publishEvent(
      'TransactionFailed',
      transactionId,
      { reason },
    );
  }
}
