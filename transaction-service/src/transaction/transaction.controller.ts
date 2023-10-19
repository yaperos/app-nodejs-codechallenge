import { Controller, Get, Param } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { EventPattern } from '@nestjs/microservices';
import { TransactionCreatedEvent } from './event/transaction-created.event';
import Transaction from './transaction.entity';

@Controller()
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @EventPattern('transaction_created')
  handleTransactionCreated(data: TransactionCreatedEvent) {
    this.transactionService.handleTransactionCreated(data);
  }

  @EventPattern('transaction_updated')
  handleTransactionUpdated(data: TransactionCreatedEvent) {
    this.transactionService.handleTransactionUpdated(data)
  }

  @Get('transaction')
  async getTransactions(): Promise<Transaction[]> {
    const transactions = await this.transactionService.getTransactions();
    return transactions;
  }

  @Get('transaction/:id')
  async getTransactionById(@Param('id') id: string): Promise<Transaction> {
    const message = await this.transactionService.getTransactionById(Number(id));
    return message;
  } 
}
