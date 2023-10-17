import { Builder } from 'builder-pattern';

export class AccountBalanceDto {
  public accountBalanceId: string;
  public userId: string;
  public amount: number;

  public static builder() {
    return Builder<AccountBalanceDto>();
  }
}
