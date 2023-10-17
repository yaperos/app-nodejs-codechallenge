import { AccountBalanceDto } from '../dto/account-balance.dto';

export interface FindAccountBalance {
  execute(accountBalanceId: string): Promise<AccountBalanceDto>;
}
