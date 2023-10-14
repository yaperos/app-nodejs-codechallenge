import { AccountDto } from '../dto/account.dto';

export interface FindAccount {
  execute(userId: string): Promise<AccountDto>;
}
