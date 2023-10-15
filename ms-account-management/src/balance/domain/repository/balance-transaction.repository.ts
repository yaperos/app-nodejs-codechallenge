import { BalanceTransaction } from '../entity/balance-transaction';

export interface BalanceTransactionRepository {
  createBalanceTransaction(
    balanceTransaction: Partial<BalanceTransaction>,
  ): Promise<void>;
}
