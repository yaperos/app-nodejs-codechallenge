import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @MessagePattern('transaction.message.event')
  handleEventAntiFraud(data: any) {
    return this.appService.handleEvent(data);
  }
}
