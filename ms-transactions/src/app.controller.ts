import { Controller, Get, Logger } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { AppService } from './app.service';
import { FindTransactionType, TransactionType, UpdateTransactionType } from './types/transactions.type';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @MessagePattern('transaction.create')
  createTransaction(@Payload() transaction: TransactionType) {
    Logger.log(`🚥 TRANSACTIONS-CONTROLLER: STARTING CREATION`)
    return this.appService.createTransaction(transaction);
  }

  @MessagePattern('transaction.list')
  getTransactions() {
    Logger.log(`🚥 TRANSACTIONS-CONTROLLER: STARTING LIST TRANSACTIONS`)
    return this.appService.getAllTransactions();
  }

  @MessagePattern('transaction.list.one')
  getTransactionById(@Payload() payload: FindTransactionType) {
    Logger.log(`🚥 TRANSACTIONS-CONTROLLER: STARTING LIST BY ID TRANSACTION`)
    return this.appService.getTransactionById(payload.id);
  }

  @EventPattern('transaction.approve')
  approveTransaction(@Payload() payload: UpdateTransactionType) {
    Logger.log(`🚥 TRANSACTIONS-CONTROLLER: STARTING APPROVING TRANSACTION`)
    this.appService.approveTransaction(payload.id);
  }

  @EventPattern('transaction.deny')
  denyTransaction(@Payload() payload: UpdateTransactionType) {
    Logger.log(`🚥 TRANSACTIONS-CONTROLLER: STARTING DENY TRANSACTION`)
    this.appService.denyTransaction(payload.id);
  }
}
