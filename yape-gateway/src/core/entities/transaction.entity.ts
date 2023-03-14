import { TransactionStatus, TransactionType } from '.';

export class Transaction {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  accountExternalIdDebit: string;
  accountExternalIdCredit: string;
  value: number;
  transactionType: TransactionType;
  transactionStatus: TransactionStatus;
}
