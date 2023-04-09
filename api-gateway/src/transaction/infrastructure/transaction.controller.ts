import { Body, Controller, Get, Post } from '@nestjs/common';
import { TransactionService } from '../application/transaction.service';
import { CreateTransactionDto } from '../domain/requests/create-transaction.dto';
import { TransactionDto } from '../domain/responses/transaction.dto';

@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Get()
  async getTransaction(): Promise<TransactionDto[]> {
    return this.transactionService.getAll();
  }

  @Post('create')
  createTransaction(@Body() body: CreateTransactionDto) {
    return this.transactionService.create(body);
  }
}
