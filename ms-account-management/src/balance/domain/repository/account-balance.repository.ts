import { AccountBalance } from '../entity/account-balance';

export interface AccountBalanceRepository {
  createAccountBalance(userId: string): Promise<void>;
  findAccountBalance(accountBalanceId: string): Promise<AccountBalance | null>;
  findAccountBalanceByUser(userId: string): Promise<AccountBalance | null>;
  updateAccountBalance(
    accountBalanceId: string,
    newAmount: number,
  ): Promise<void>;
}
