import { AccountBalanceDto } from '../dto/account-balance.dto';

export interface FindAccountBalance {
  execute(userId: string): Promise<AccountBalanceDto>;
}
