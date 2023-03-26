import { Controller, Logger } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices/decorators';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @EventPattern('transaction.created')
  async handleTransactionCreated(data: any) {
    Logger.debug('Transaction created: ' + JSON.stringify(data));
    this.appService.verifyAntiFraud(data);
  }
}
