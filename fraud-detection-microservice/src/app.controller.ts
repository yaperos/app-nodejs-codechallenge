import { Controller } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern('detect_fraud')
  detectFraud(@Payload() transactionValue): number {
    return this.appService.validateTransactionValue(Number(transactionValue));
  }
}
