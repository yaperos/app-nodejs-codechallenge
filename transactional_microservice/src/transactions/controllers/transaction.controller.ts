import { Body, Controller, Post } from '@nestjs/common';
import { TransactionService } from '../services/transaction.service';
import { CreateTransactionDto } from '../dto/create_transaction.dto';

@Controller('transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}
  @Post()
  createTransaction(@Body() payload: CreateTransactionDto) {
    return this.transactionService.createTransaction(payload);
  }
}
