import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { TransactionDto } from './transaction.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern('check-transaction')
  checkTransactionEvent(@Payload() msg: TransactionDto){
    return this.appService.checkTransaction(msg);
  }
}
