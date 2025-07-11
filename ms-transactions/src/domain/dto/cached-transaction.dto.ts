import { TransactionStatus, TransactionType } from '../enums/transaction.enums';

export interface CachedTransactionDTO {
  id: string;
  accountDebit: string;
  accountCredit: string;
  transferType: TransactionType;
  status: TransactionStatus;
  value: string;
  createdAt: string;
}
