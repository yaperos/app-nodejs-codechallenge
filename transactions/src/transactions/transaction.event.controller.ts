import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { TransactionCreatedEvent } from './transaction-created.event';
import { TransactionService } from './transactions.service';
import { config } from './../config';

@Controller()
export class AppController {
  constructor(private readonly appService: TransactionService) {}

  @EventPattern('yape.app.transactions')
  async handleTransaction(@Payload() event: TransactionCreatedEvent) {
    if (event.transactionStatus !== config.created_status) {
      await this.appService.handleTransactionCreated(event);
    }
  }
}
