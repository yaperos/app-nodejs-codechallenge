import { Body, Controller, Inject, Post } from '@nestjs/common';
import { GenericResponseDto } from 'src/accounts/domain/dto/generic-response.dto';
import { CreateAccountBalanceRequestDto } from '../dto/create-account-balance-request.dto';
import { CreateAccountBalance } from 'src/balance/domain/use-case/create-account-balance';

@Controller('api/v1/balance/account-balance')
export class CreateAccountBalanceController {
  public constructor(
    @Inject('CREATE_ACCOUNT_BALANCE')
    private readonly createAccountBalance: CreateAccountBalance,
  ) {}

  @Post()
  public async execute(
    @Body() dto: CreateAccountBalanceRequestDto,
  ): Promise<GenericResponseDto> {
    return await this.createAccountBalance.execute(dto);
  }
}
