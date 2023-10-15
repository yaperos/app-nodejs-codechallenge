export interface BalanceTransactionStrategy {
  execute(currentBalance: number, newAmount: number): number;
}
