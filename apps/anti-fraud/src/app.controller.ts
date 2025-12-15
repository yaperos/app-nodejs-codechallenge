import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @EventPattern('transaction_created')
  handleTransactionCreated(@Payload() data: any) {
    this.appService.handleTransactionCreated(data);
  }
}