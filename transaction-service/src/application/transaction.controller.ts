import { Body, Controller, Get, Post } from '@nestjs/common';
import { TransactionDto } from 'src/domain/transaction.dto';
import { TransactionService } from './transaction.service';

@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post('add')
  createTransaction(@Body() transaction: TransactionDto): Promise<void> {
    return this.transactionService.add(transaction);
  }
}
