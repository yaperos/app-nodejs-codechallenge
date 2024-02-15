import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AppService } from './app.service';
import { TransactionSearchedRequest } from './dto/transaction-searched-request.dto';
import { CreateTransactionDto } from './dto/transaction-created.dto';
import { TransactionUpdatedEvent } from './events/transaction-updated.event';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern('create_transaction')
  createTransaction(transactionCreatedRequest: CreateTransactionDto) {
    return this.appService.createTransaction(transactionCreatedRequest);
  }

  @MessagePattern('search_transaction')
  getTransaction(transactionCreatedRequest: TransactionSearchedRequest) {
    return this.appService.getTransaction(transactionCreatedRequest);
  }

  @MessagePattern('transaction_updated')
  updateTransaction(transactionUpdatedRequest: TransactionUpdatedEvent) {
    return this.appService.updateTransaction(transactionUpdatedRequest);
  }
}
