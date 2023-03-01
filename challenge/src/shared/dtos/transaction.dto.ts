import type { Transaction } from 'src/transactions/entities/transaction.entity';

export class TransactionDto {
  transactionExternalId: string;

  transactionType: {
    name: string;
  };

  transactionStatus: {
    name: string;
  };

  value: number;

  createdAt: Date | string;

  constructor();
  constructor(entry: Transaction);
  constructor(entry?: Transaction) {
    if (entry) {
      this.transactionExternalId = entry.transactionExternalId;
      this.transactionType = {
        name: entry.transactionType.toString(),
      };
      this.transactionStatus = {
        name: entry.transactionStatus,
      };
      this.value = entry.value;
      this.createdAt = entry.createdAt;
    }
  }
}
