import { Inject, Injectable } from '@nestjs/common';
import { TransactionCreatedEvent } from './transaction-created-event';
import { RetrieveTransaction } from './dtos/retrieve-transaction.dto';
import { TransactionStatusEnum } from './enums/trasaction-status.enum';

@Injectable()
export class AppService {
  constructor(){}

  getHello(): string {
    return 'Hello World!';
  }

  async handleTransactionCreated(transactionCreatedEvent: TransactionCreatedEvent) {  
    console.log("🚀 ~ AppService ~ handleTransactionCreated ~ transactionCreatedEvent:", transactionCreatedEvent)
    
    let response = new RetrieveTransaction();
    response.transactionType.name = transactionCreatedEvent.transferTypeId.toString();
    response.value = transactionCreatedEvent.valueTransaction;

    if (transactionCreatedEvent.valueTransaction > 1000) {
      console.log(`The transaction ID: ${transactionCreatedEvent.transactionId} was REJECTED cause the value amount is more than $1000.00`);
      response.transactionStatus.name = TransactionStatusEnum.REJECTED;
    } else {
      console.log(`The transaction ID: ${transactionCreatedEvent.transactionId} was APPROVED`);
      response.transactionStatus.name = TransactionStatusEnum.APPROVED;
    }
    
    console.log("RESPONSE Of emit status for transaction: ", response);

    return JSON.stringify(response);
  }
}