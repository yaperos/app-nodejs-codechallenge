import { TransactionType } from 'src/balance/domain/entity/balance-transaction';
import { BalanceTransactionStrategy } from './strategy/balance-transaction.strategy';
import { CreditBalanceTransactionStrategy } from './strategy/credit-balance-transaction.strategy';
import { DebitBalanceTransactionStrategy } from './strategy/debit-balance-transaction.strategy';

export const selectStrategy = (
  transactionType: TransactionType,
): BalanceTransactionStrategy => {
  const strategies = {
    CREDIT: CreditBalanceTransactionStrategy,
    DEBIT: DebitBalanceTransactionStrategy,
  };

  return new strategies[transactionType]();
};
