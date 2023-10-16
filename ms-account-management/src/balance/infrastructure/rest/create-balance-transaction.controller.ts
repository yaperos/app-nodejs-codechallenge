import { Body, Controller, Inject, Post } from '@nestjs/common';
import { GenericResponseDto } from 'src/accounts/domain/dto/generic-response.dto';
import { CreateBalanceTransaction } from 'src/balance/domain/use-case/create-balance-transaction';
import { CreateBalanceTransactionRequestDto } from '../dto/create-balance-transaction-request.dto';

@Controller('api/v1/balance/balance-transaction')
export class CreateBalanceTransactionController {
  public constructor(
    @Inject('CREATE_BALANCE_TRANSACTION')
    private readonly createBalanceTransaction: CreateBalanceTransaction,
  ) {}

  @Post()
  public async execute(
    @Body() dto: CreateBalanceTransactionRequestDto,
  ): Promise<GenericResponseDto> {
    return await this.createBalanceTransaction.execute(dto);
  }
}
