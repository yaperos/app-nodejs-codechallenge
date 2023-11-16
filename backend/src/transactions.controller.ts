import { Controller, Post, Body, Get } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { Transaction } from './transaction.entity';

@Controller('api/transactions')
export class TransactionsController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post()
  async createTransaction (@Body() transactionData: any): Promise<Transaction> {
    const createdTransaction = await this.transactionService.createTransaction(transactionData);
    return createdTransaction;
  }

  @Get()
  async getTransaction (@Body() transactionData: any): Promise<Transaction> {
    if(transactionData.transactionExternalId){
      const obtTransaction = await this.transactionService.getTransaction(transactionData.transactionExternalId);
      return obtTransaction;
    }
  }
}
