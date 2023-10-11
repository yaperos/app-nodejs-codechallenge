import { Controller, Get, Post, Body } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDTO } from './dtos/create-transaction.dto';

@Controller()
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Get()
  getHello(): string {
    return this.transactionsService.getHello();
  }

  @Post()
  createTransaction(@Body() newTransaction: CreateTransactionDTO) {
    this.transactionsService.createTransaction(newTransaction);
  }
}
