import { AccountDto } from 'src/accounts/domain/dto/account.dto';
import { Account } from 'src/accounts/domain/entity/account';

export abstract class AccountMapper {
  public static toDto(account: Account): AccountDto {
    return AccountDto.builder()
      .userId(account.userId)
      .email(account.email)
      .phone(account.phone)
      .firstName(account.identification.firstName)
      .lastName(account.identification.lastName)
      .build();
  }
}
