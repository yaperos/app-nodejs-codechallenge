import { Account } from '../entity/account';

export interface AccountRepository {
  createAccount(account: Partial<Account>): Promise<Account>;
  updateAccount(
    userId: string,
    account: Partial<Account>,
  ): Promise<Account | null>;
  findAccount(userId: string): Promise<Account | null>;
}
