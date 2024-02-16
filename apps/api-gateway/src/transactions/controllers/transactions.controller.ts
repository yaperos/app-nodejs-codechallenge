import { Body, Controller, Get, Post } from '@nestjs/common';
import { TransactionsService } from '../services/transactions.service';
import { CreateTransactionDto } from 'apps/api-gateway/src/transactions/dtos/requests/create-transaction.dto';
import { TransactionDto } from 'apps/api-gateway/src/transactions/dtos/responses/transaction.dto';
import { GetTransactionDto } from 'apps/api-gateway/src/transactions/dtos/requests/get-transaction.dto';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  async createTransaction(
    @Body() input: CreateTransactionDto,
  ): Promise<TransactionDto> {
    return this.transactionsService.create(input);
  }

  @Get()
  async getTransaction(
    @Body() input: GetTransactionDto,
  ): Promise<TransactionDto> {
    return this.transactionsService.getOne(input);
  }
}
