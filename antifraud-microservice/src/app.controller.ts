import { Controller } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern('transaction.validate')
  public transactionValidate(transaction: any) {
    const { transactionId, transactionAmount } = transaction;
    const valid = this.appService.validate(transactionAmount);
    return {
      transactionId,
      transactionStatus: valid,
    };
  }
}
