import { Controller, Post, Body, Get } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionDto } from './dtos/transaction.dto';

@Controller('transactions')
export class TransactionsController {
  constructor(
    private readonly transactionsService: TransactionsService,
    ) {}

    @Post()
    createTransaction(@Body() createTransaction: TransactionDto) {
      return this.transactionsService.createTransaction(createTransaction);
    }

    @Get('test')
    getTest(){
      return this.transactionsService.get();
    }

}
