import { Controller, Get } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { AppService } from './antifraude.service';
import { TransactionCreatedEvent } from './transaction-created.event';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @EventPattern('yape.app.transactions')
  async handleTransaction(@Payload() message: TransactionCreatedEvent) {
    if (message.transactionStatus === process.env.STATUS_CREATED) {
      await this.appService.handleTransactionCreated(message);
    }
  }
}
