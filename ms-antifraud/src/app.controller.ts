import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { CheckTransactionDto } from './check-transaction.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern('verify-transaction')
  handleEventVerifyTransaction(@Payload() data: CheckTransactionDto) {
    return this.appService.verifyTransaction(data);
  }
}
