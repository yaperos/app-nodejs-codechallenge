import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CheckEventTransactionDto } from './dtos/check-event-transaction.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern('transaction-created')
  handleEventVerifyTransaction(@Payload() data: CheckEventTransactionDto) {
    console.log("retrieve: ",CheckEventTransactionDto);
    return this.appService.antiFraudVerify(data);
  }
}