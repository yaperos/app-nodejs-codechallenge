import { Transaction } from '../entities/transaction.entity';

export class TransactionEvent {
  static getName(): string {
    return 'transaction.created';
  }
  static toEvent(transaction: Transaction): string {
    return JSON.stringify({
      transactionExternalId: transaction.id,
      transactionType: {
        name: transaction.transactionTypeId,
      },
      transactionStatus: {
        name: transaction.transactionStatusId,
      },
      value: transaction.value,
      createdAt: transaction.createdAt,
    });
  }
}
