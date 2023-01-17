import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AppService } from './app.service';
import { TransactionCreatedEvent } from './models/transaction-created.event';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern('transaction.created')
  async approvedTransaction(
    @Payload() payload: TransactionCreatedEvent,
  ): Promise<void> {
    Logger.debug(payload);
    await this.appService.evaluateTransaction(payload);
  }
}
