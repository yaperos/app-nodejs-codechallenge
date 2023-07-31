import { Transaction } from '@nestjs-microservices/shared/entities';
import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';

import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @EventPattern('transaction.created')
  handleProcessTransaction(@Payload() data: Transaction) {
    this.appService.processTransaction(data);
  }
}
