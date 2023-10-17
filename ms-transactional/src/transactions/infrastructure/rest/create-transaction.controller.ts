import { Body, Controller, Inject, Post } from '@nestjs/common';
import { CreateTransaction } from 'src/transactions/domain/use-case/create-transation';
import { CreateTransactionRequestDto } from '../dto/create-transaction-request.dto';
import { GenericResponseDto } from 'src/transactions/domain/dto/generic-response.dto';

@Controller('api/v1/transactions')
export class CreateTransactionController {
  public constructor(
    @Inject('CREATE_TRANSACTION')
    private readonly createTransaction: CreateTransaction,
  ) {}

  @Post()
  public async execute(
    @Body() dto: CreateTransactionRequestDto,
  ): Promise<GenericResponseDto> {
    return await this.createTransaction.execute(dto);
  }
}
