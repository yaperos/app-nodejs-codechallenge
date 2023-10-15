import { TransactionType } from '../entity/balance-transaction';

export interface CreateBalanceTransactionRequestDto {
  accountBalanceId: string;
  transactionType: TransactionType;
  description: string;
  amount: number;
}
