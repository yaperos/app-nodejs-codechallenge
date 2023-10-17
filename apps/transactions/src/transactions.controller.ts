import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDTO } from './dtos/create-transaactions.dto';
import { EventPattern } from '@nestjs/microservices';

@Controller()
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  createTransaction(@Body() newTransaction: CreateTransactionDTO) {
    this.transactionsService.createTransaction(newTransaction);
  }

  @Get('/:id')
  getTransaction(@Param('id') id: string) {
    return this.transactionsService.getTransactionById(id);
  }

  @Get()
  fetchTransactions() {
    return this.transactionsService.fetchTransactions();
  }

  @EventPattern('transaction_processed')
  handleTransactionCreated(data: any) {
    this.transactionsService.updateTransactionStatus(data.id, data.status);
  }
}
