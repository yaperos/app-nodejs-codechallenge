import { Controller, Get, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { AppService } from './app.service';
import { ValidateTransactionType } from './types/antifraud';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @EventPattern('transaction.validate')
  validateTransaction(@Payload() transaction: ValidateTransactionType) {
    Logger.log(`🚥 ANTIFRAUD-CONTROLLER: STARTING VALIDATION`)
    this.appService.validate(transaction);
  }
}
