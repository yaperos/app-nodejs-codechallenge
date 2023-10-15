export interface UpdateAccountBalance {
  execute(accountBalanceId: string, newAmount: number): Promise<void>;
}
