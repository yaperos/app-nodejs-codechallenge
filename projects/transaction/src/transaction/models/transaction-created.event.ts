import { Transaction } from './transaction.entity';

export class TransactionCreatedEvent {
  static getName(): string {
    return 'transaction.created';
  }

  static toEvent(transaction: Transaction): string {
    return JSON.stringify({
      transactionExternalId: transaction.id,
      transactionType: {
        name: transaction.type,
      },
      transactionStatus: {
        name: transaction.status,
      },
      value: transaction.value,
      createdAt: transaction.createdAt,
    });
  }
}
