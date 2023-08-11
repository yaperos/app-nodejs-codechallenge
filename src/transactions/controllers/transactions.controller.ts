import { TransactionDto } from './../dto/transaction.dto';
import { Body, Controller, Get, Post } from '@nestjs/common';
import { TransactionsService } from '../services/transactions.service';

@Controller('transactions')
export class TransactionsController {
    constructor(private readonly transactionService: TransactionsService) {}

    @Post('register')
    public async registerTransaction(@Body() body: TransactionDto){
      return  await this.transactionService.createTransaction(body)
    }
}
