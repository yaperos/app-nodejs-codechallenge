import { Controller } from '@nestjs/common';
import { AppService } from './app.service';
import { EventPattern } from '@nestjs/microservices';
import { Event } from './interface/event';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @EventPattern('transaction_queue')
  handleTransaction(data: Event) {
    this.appService.handleTransaction(data);
  }
}
