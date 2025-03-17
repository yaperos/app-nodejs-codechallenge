import { CreateTransactionRequest } from '../../infrastructure/dto/create-transaction.request';
import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { TransactionEvent } from '../../infrastructure/dto/transaction-event.response';
import { TransactionService } from '../../application/transaction.service';

@Controller('api/v1/transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post()
  async postTransaction(
    @Body() postData: CreateTransactionRequest,
  ): Promise<TransactionEvent> {
    return await this.transactionService.createTransaction(postData);
  }

  @Get()
  async getTransaction(
    @Query('debitId') debitId: string,
    @Query('creditId') creditId: string,
  ): Promise<TransactionEvent> {
    return await this.transactionService.getTransaction(debitId, creditId);
  }
}
