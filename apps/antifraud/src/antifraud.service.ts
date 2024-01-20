import { Injectable } from '@nestjs/common';
import { TransactionReceivedEvent } from './events/transaction-received.event';

@Injectable()
export class AntifraudService {
  getHello(): string {
    return 'Hello World!';
  }

  transactionValidator(data: any) {
    console.log('data listening in transactionValidator', data);
  }
}
