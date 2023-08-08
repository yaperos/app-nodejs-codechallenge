import { Body, Controller, Get, Post } from '@nestjs/common';

import { CreateTransactionDto } from '../dto';
import { TransactionService } from '../services/transaction.service';
import { TransactionStatusService } from '../services';
import { EventPattern, Payload } from '@nestjs/microservices';

@Controller('transaction')
export class TransactionController {
  constructor(
    private readonly transactionService: TransactionService,
    private readonly transactionStatusService: TransactionStatusService,
  ) {}

  @Post()
  createTransaction(@Body() body: CreateTransactionDto) {
    return this.transactionService.save(body);
  }

  @Get()
  getTransactions() {
    return this.transactionService.findAll();
  }

  @EventPattern('transaction_rejected_event')
  RejectedTransactionEvent(@Payload() data: any): void {
    console.log(
      'evento transaction_rejected_event en transaction.controller : ',
      data,
    );
    this.transactionService.update(data);
  }

  @EventPattern('transaction_approved_event')
  ApprovedTransactionEvent(@Payload() data: any): void {
    console.log(
      'evento  transaction_approved_event en transaction.controller: ',
      data,
    );
    this.transactionService.update(data);
  }
}
