import { AccountBalance } from '../entity/account-balance';

export interface AccountBalanceRepository {
  createAccountBalance(userId: string): Promise<void>;
  findAccountBalance(userId: string): Promise<AccountBalance | null>;
  updateAccountBalance(
    accountBalanceId: string,
    newAmount: number,
  ): Promise<void>;
}
