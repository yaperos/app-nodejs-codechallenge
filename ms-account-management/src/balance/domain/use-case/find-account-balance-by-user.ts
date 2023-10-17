import { AccountBalanceDto } from '../dto/account-balance.dto';

export interface FindAccountBalanceByUser {
  execute(userId: string): Promise<AccountBalanceDto>;
}
