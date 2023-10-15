import { Controller, Post, Body } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDTO } from './dtos/create-transaactions.dto';
import { EventPattern } from '@nestjs/microservices';

@Controller()
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  createTransaction(@Body() newTransaction: CreateTransactionDTO) {
    this.transactionsService.createTransaction(newTransaction);
    console.log('aca si');
  }

  @EventPattern('transaction_processed')
  handleTransactionCreated(data: any) {
    console.log('xdxd', data);
  }
}
