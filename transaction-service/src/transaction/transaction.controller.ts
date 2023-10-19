import { Controller, Get } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { EventPattern } from '@nestjs/microservices';
import { TransactionCreatedEvent } from './event/transaction-created.event';

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
}
