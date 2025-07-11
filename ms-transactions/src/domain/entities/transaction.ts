import Decimal from 'decimal.js';
import { TransactionStatus, TransactionType } from '../enums/transaction.enums';

export class Transaction {
  id: string;
  accountDebit: string;
  accountCredit: string;
  transferType: TransactionType;
  status: TransactionStatus;
  value: Decimal;
  createdAt: Date;
}
