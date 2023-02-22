import { Controller, Get, Inject, OnModuleInit } from '@nestjs/common';
import { ClientKafka, EventPattern } from '@nestjs/microservices';
import { TransactionService } from '../services/transaction.service';

@Controller()
export class TransactionController {
  constructor(
    private readonly transactionService: TransactionService
  ) {}

  @EventPattern('transaction_created')
  handleTransactionCreated(data: any) {

    console.log("data entrada", data);
    this.transactionService.handleTransactionCreated(data.value);
  }
}
