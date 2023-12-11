import { Controller } from '@nestjs/common';
import { AppService } from './app.service';
import { EventPattern } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @EventPattern('validation_queue')
  validateTransaction(data: any) {
    this.appService.validateTransaction(data);
  }
}
