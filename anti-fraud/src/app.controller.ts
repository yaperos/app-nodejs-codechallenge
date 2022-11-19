import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AppService } from './app.service';
import { TransactionEvent } from './transactionEvent';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern('anti-fraud')
  async handleantiFraud(data: TransactionEvent) {
    let transactionStatusChanged;
    const amount = data.value;
    if (amount > 1000) {
      transactionStatusChanged = {
        ...data,
        transactionStatus: 'rejected',
      };
    } else {
      transactionStatusChanged = {
        ...data,
        transactionStatus: 'approved',
      };
    }
    return transactionStatusChanged;
  }
}