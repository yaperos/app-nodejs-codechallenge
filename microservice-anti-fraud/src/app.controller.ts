import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AppService } from './app.service';
import { TransactionToVerifyDTO } from './dtos/transaction.to.verify.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern('transaction-created')
  verifyTransaction(
    @Payload('value') message: TransactionToVerifyDTO
  ): void {
    Logger.log('[verifyTransaction] PAYLOAD: ', message);
    this.appService.verifyTransaction(message);
  }
}
