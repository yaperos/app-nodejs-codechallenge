import { Injectable } from '@nestjs/common';
import { TransactionCreatedEvent } from './event/transaction-created.event';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  handleTransactionPending(data: TransactionCreatedEvent) {
    console.log(data.value)
  }
}
