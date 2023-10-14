import { Controller, Get, Inject, Param } from '@nestjs/common';
import { AccountDto } from 'src/accounts/domain/dto/account.dto';
import { FindAccount } from 'src/accounts/domain/use-case/find-account';

@Controller('api/v1/accounts')
export class FindAccountController {
  public constructor(
    @Inject('FIND_ACCOUNT') private readonly findAccount: FindAccount,
  ) {}

  @Get(':userId')
  public async execute(@Param('userId') userId: string): Promise<AccountDto> {
    return await this.findAccount.execute(userId);
  }
}
