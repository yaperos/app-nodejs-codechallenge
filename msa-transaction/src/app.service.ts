import { Injectable,Logger } from '@nestjs/common';
import { TransactionCreatedEvent } from './transaction-created.event';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World! transaction';
  }
  handleTransactionCreated(transactionCreatedEvent:TransactionCreatedEvent){
    Logger.log(transactionCreatedEvent) 
  }
 
}
