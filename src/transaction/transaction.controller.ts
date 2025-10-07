import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CreateTransactionInput } from './dto/create-transaction.input';

@Controller('transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post()
  async create(@Body() input: CreateTransactionInput) {
    return this.transactionService.createTransaction(input);
  }

  @Get(':transactionExternalId')
  async findOne(@Param('transactionExternalId') transactionExternalId: string) {
    return this.transactionService.getTransaction(transactionExternalId);
  }
}
