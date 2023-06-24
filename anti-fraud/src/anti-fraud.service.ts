import { Inject, Injectable } from '@nestjs/common';
import { TransactionCreatedEvent } from './event/transaction-created-event';
import { ClientKafka } from '@nestjs/microservices';
import { UpdateTransactionStatusEvent } from './event/update-transaction-status-event';
import { TransactionStatus } from './enum/transaction-status';

@Injectable()
export class AntiFraudService {
  constructor(
    @Inject('TRANSACTIONS_MICROSERVICE')
    private readonly transactionsClient: ClientKafka,
  ) {}

  handleTransactionCreated(
    transactionCreatedEvent: TransactionCreatedEvent,
  ): void {
    const updateTransactionStatusEvent = this.validateTransaction(
      transactionCreatedEvent,
    );
    this.emitUpdateEvent(updateTransactionStatusEvent);
  }

  private validateTransaction(
    transactionCreatedEvent: TransactionCreatedEvent,
  ): UpdateTransactionStatusEvent {
    const status =
      transactionCreatedEvent.val > 1000
        ? TransactionStatus.REJECTED
        : TransactionStatus.APPROVED;
    return new UpdateTransactionStatusEvent(
      transactionCreatedEvent.transactionExternalId,
      status,
    );
  }

  private emitUpdateEvent(
    updateTransactionStatusEvent: UpdateTransactionStatusEvent,
  ): void {
    this.transactionsClient.emit(
      'update_transaction_status',
      updateTransactionStatusEvent,
    );
  }
}
