import { BalanceTransactionStrategy } from './balance-transaction.strategy';

export class DebitBalanceTransactionStrategy
  implements BalanceTransactionStrategy
{
  public execute(currentBalance: number, newAmount: number): number {
    return currentBalance - newAmount;
  }
}
