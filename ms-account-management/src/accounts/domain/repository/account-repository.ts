import { Account } from '../entity/account';

export interface AccountRepository {
  createAccount(account: Partial<Account>): Promise<Account>;
  updateAccount(account: Partial<Account>): Promise<Account>;
  findAccount(userId: string): Promise<Account | null>;
}
