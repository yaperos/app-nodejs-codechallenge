import { Inject, Injectable,Logger } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { GetValidateTransaction } from './get-validate-transaction.dto';
import { TransactionCreatedEvent } from './transaction-created.event';

@Injectable()
export class AppService {
  constructor(
    @Inject('ANTIFRAUD_SERVICE') private readonly antiFraud:ClientKafka
  ){}

  getHello(): string {
    return 'Hello World! transaction';
  }

  handleTransactionCreated(transactionCreatedEvent:TransactionCreatedEvent){
    //Logger.log(transactionCreatedEvent) 
    this.antiFraud
    .send('get_validate_fraud',new GetValidateTransaction(transactionCreatedEvent.transactionExternalId))
    .subscribe((transaction)=>{
        console.log(
          `demo yape challenge ${transaction.transactionExternalId}`
        );
      });
  }
 
}
