import { Injectable } from '@nestjs/common';
import { BalanceTransactionStrategy } from './strategy/balance-transaction.strategy';

@Injectable()
export class BalanceTransactionContext {
  private balanceTransactionStrategy: BalanceTransactionStrategy;

  public setStrategy(
    balanceTransactionStrategy: BalanceTransactionStrategy,
  ): void {
    this.balanceTransactionStrategy = balanceTransactionStrategy;
  }

  public execute(currentBalance: number, newAmount: number): number {
    return this.balanceTransactionStrategy.execute(currentBalance, newAmount);
  }
}
