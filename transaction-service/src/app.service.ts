import { Injectable } from '@nestjs/common';
import { TransactionCreatedEvent } from './event/transaction-created.event';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  handleTransactionCreated(transactionCreatedEvent: TransactionCreatedEvent){
    console.log(transactionCreatedEvent)
  }
}
