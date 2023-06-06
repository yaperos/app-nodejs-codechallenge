import { Body, Controller, Post } from '@nestjs/common';
import { TransactionService } from './transactions.service';
import { CreateTransactionRequest } from './create-transaction.dto';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly appService: TransactionService) {}

  @Post()
  createTransactional(
    @Body() createdTransactionRequest: CreateTransactionRequest,
  ) {
    this.appService.createTransaction(createdTransactionRequest);
  }
}
