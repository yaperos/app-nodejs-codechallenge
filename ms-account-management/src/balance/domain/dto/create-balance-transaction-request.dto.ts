import { TransactionType } from '../entity/balance-transaction';

export interface CreateBalanceTransactionRequestDto {
  accountBalanceId: string;
  userId: string;
  transactionType: TransactionType;
  description: string;
  amount: number;
}
