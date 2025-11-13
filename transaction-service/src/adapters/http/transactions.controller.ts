import { Body, Controller, Get, Inject, Param, Post } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateTransactionUseCase } from '@ports/in/create-transaction.use-case';
import { GetTransactionUseCase } from '@ports/in/get-transaction.use-case';
import {
  CREATE_TRANSACTION_USE_CASE,
  GET_TRANSACTION_USE_CASE,
} from '@ports/tokens';
import { CreateTransactionRequestDto } from './dto/create-transaction.request.dto';
import { CreateTransactionResponseDto } from './dto/create-transaction.response.dto';
import { TransactionViewDto } from './dto/transaction.view.dto';
import {
  toCreateTransactionResponseDto,
  toTransactionViewDto,
} from './mappers/transaction.mapper';
import { CreateTransactionCommand } from '@application/commands/create-transaction.command';

@ApiTags('transactions')
@Controller('transactions')
export class TransactionsController {
  constructor(
    @Inject(CREATE_TRANSACTION_USE_CASE)
    private readonly createTransactionUseCase: CreateTransactionUseCase,
    @Inject(GET_TRANSACTION_USE_CASE)
    private readonly getTransactionUseCase: GetTransactionUseCase,
  ) {}

  @Post()
  @ApiResponse({ status: 201, type: CreateTransactionResponseDto })
  async create(
    @Body() body: CreateTransactionRequestDto,
  ): Promise<CreateTransactionResponseDto> {
    const command: CreateTransactionCommand = {
      accountExternalIdDebit: body.accountExternalIdDebit,
      accountExternalIdCredit: body.accountExternalIdCredit,
      transferTypeId: body.tranferTypeId,
      value: body.value,
      transactionExternalId: body.transactionExternalId,
    };

    const transaction = await this.createTransactionUseCase.execute(command);
    return toCreateTransactionResponseDto(transaction);
  }

  @Get(':transactionExternalId')
  @ApiResponse({ status: 200, type: TransactionViewDto })
  async getById(
    @Param('transactionExternalId') transactionExternalId: string,
  ): Promise<TransactionViewDto> {
    const transaction = await this.getTransactionUseCase.execute(
      transactionExternalId,
    );
    return toTransactionViewDto(transaction);
  }
}
