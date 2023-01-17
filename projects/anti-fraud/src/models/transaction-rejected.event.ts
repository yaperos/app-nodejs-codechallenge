import { TransactionCreatedEvent } from './transaction-created.event';

export class TransactionRejectedEvent {
  static getName(): string {
    return 'transaction.rejected';
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
