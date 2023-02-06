import { Body, Controller, Post } from '@nestjs/common';
import { CreateTransactionRequest } from 'src/transactions/DTO/create-transactions.dto';
import { TransactionsService } from './transactions.service';

@Controller('transactions')
export class TransactionsController {
  constructor(private transactionService: TransactionsService) {}

  @Post()
  createTransaction(@Body() newTransaction: CreateTransactionRequest) {
    return this.transactionService.createTransaction(newTransaction);
  }
}
