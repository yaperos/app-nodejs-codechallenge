import { Controller, Get, Inject, Param } from '@nestjs/common';
import { AccountBalanceDto } from 'src/balance/domain/dto/account-balance.dto';
import { FindAccountBalance } from 'src/balance/domain/use-case/find-account-balance';

@Controller('api/v1/balance/account-balance')
export class FindAccountBalanceController {
  public constructor(
    @Inject('FIND_ACCOUNT_BALANCE')
    private readonly findAccountBalance: FindAccountBalance,
  ) {}

  @Get(':accountBalanceId')
  public async execute(
    @Param('accountBalanceId') accountBalanceId: string,
  ): Promise<AccountBalanceDto> {
    return await this.findAccountBalance.execute(accountBalanceId);
  }
}
