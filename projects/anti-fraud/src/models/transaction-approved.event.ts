import { TransactionCreatedEvent } from './transaction-created.event';

export class TransactionApprovedEvent {
  static getName(): string {
    return 'transaction.approved';
  }

  static toEvent(transaction: TransactionCreatedEvent): string {
    return JSON.stringify({
      transactionExternalId: transaction.transactionExternalId,
      transactionType: transaction.transactionType,
      transactionStatus: transaction.transactionStatus,
      value: transaction.value,
      createdAt: transaction.createdAt,
    });
  }
}
