export enum TransactionType {
  DEBIT = 'DEBIT',
  CREDIT = 'CREDIT',
}

export interface BalanceTransaction {
  balanceTransactionId: string;
  accountBalanceId: string;
  transactionType: TransactionType;
  description: string;
  amount: number;
  createdAt: Date;
}
