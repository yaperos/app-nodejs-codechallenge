import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { FindByIdTransactionUseCase } from '../../../application/use-cases/find-by-id-transaction.use-case';
import { SaveTransactionUseCase } from '../../../application/use-cases/save-transaction.use-case';
import { CreateTransactionDto } from '../dtos/create-transaction-request.dto';
import { ParamsWithId } from '../dtos/param-transaction-request.dto';
import { TransactionsMapper } from '../mappers/transaction-mapper';

@Controller('transaction')
@ApiTags('transaction')
export class TransactionController {
  constructor(
    private readonly saveTransactionUseCase: SaveTransactionUseCase,
    private readonly findByIdTransactionUseCase: FindByIdTransactionUseCase,
  ) {}

  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'The Transaction has been successfully retrieved.',
  })
  async getTransaction(@Param() { id }: ParamsWithId) {
    const transaction = await this.findByIdTransactionUseCase.execute(id);
    return TransactionsMapper.toDto(transaction);
  }

  @Post()
  @ApiResponse({
    status: 201,
    description: 'The Transaction has been successfully created.',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error.',
  })
  async saveTransaction(@Body() body: CreateTransactionDto) {
    await this.saveTransactionUseCase.execute(body);
  }
}
