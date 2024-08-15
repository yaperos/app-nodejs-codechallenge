import { Controller, Body, Post } from '@nestjs/common';
import { TransactionDTO } from '../dtos/transaction.dto';
import { TransactionsService } from '../services/transactions.service';

@Controller('transactions')
export class TransactionsController {
  constructor(private transactionService: TransactionsService) {}

  @Post()
  async create(@Body() transaction: TransactionDTO): Promise<TransactionDTO> {
    return await this.transactionService.createTransaction(transaction);
  }
}
