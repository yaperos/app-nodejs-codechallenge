import { TransactionStatusEnum } from '../enums/transaction.status.enum';

export interface Transaction {
  id: string;
  transactionExternalId: string;
  transactionType: number;
  transactionStatus: TransactionStatusEnum;
  value: number;
  createdAt: string;
}
