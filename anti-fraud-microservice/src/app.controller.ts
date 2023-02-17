import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @EventPattern('validate-transaction')
  handleProcessPayment(@Payload() data: any): string {
    console.log('Message received');
    console.log(data);
    return this.appService.getHello();
  }
}
