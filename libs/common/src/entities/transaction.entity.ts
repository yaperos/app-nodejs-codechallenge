import { TransactionType } from './transaction-type.entity';

export class Transaction {
  transactionExternalId: string;
  value: number;
  createdAt: Date;
  updatedAt: Date;
  transactionType: TransactionType;
  status: string;
}
