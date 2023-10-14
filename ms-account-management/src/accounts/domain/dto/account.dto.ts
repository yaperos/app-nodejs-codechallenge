import { Builder } from 'builder-pattern';

export class AccountDto {
  public userId: string;
  public email: string;
  public phone: string;
  public firstName: string;
  public lastName: string;

  public static builder() {
    return Builder<AccountDto>();
  }
}
