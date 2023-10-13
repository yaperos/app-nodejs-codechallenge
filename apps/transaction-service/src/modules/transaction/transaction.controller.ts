import { Body, Controller, Post } from '@nestjs/common';
import { TransactionService } from './transaction.service';

@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post()
  async createTransaction(@Body() transactionDto: any): Promise<any> {
    console.log(transactionDto);
    return transactionDto;
  }
}
