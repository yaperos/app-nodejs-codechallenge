import { Controller, Get, Inject, Param } from '@nestjs/common';
import { AccountBalanceDto } from 'src/balance/domain/dto/account-balance.dto';
import { FindAccountBalanceByUser } from 'src/balance/domain/use-case/find-account-balance-by-user';

@Controller('api/v1/balance/account-balance')
export class FindAccountBalanceByUserController {
  public constructor(
    @Inject('FIND_ACCOUNT_BALANCE_BY_USER')
    private readonly findAccountBalanceByUser: FindAccountBalanceByUser,
  ) {}

  @Get('/user/:userId')
  public async execute(
    @Param('userId') userId: string,
  ): Promise<AccountBalanceDto> {
    return await this.findAccountBalanceByUser.execute(userId);
  }
}
