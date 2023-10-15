import { AccountBalanceDto } from 'src/balance/domain/dto/account-balance.dto';
import { AccountBalance } from 'src/balance/domain/entity/account-balance';

export abstract class AccountBalanceMapper {
  public static toDto(accountBalance: AccountBalance): AccountBalanceDto {
    return AccountBalanceDto.builder()
      .accountBalanceId(accountBalance.accountBalanceId)
      .amount(accountBalance.amount)
      .build();
  }
}
