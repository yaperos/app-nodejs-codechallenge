import { Inject, Injectable } from '@nestjs/common';
import { TransactionDto } from './transaction.dto';
import { ClientKafka } from '@nestjs/microservices';
import { Status } from './status.enum';

@Injectable()
export class AppService {
  constructor(
    @Inject('ANTIFRAUD_RESPONSE') private readonly clientKafka: ClientKafka ) 
  {}
  checkTransaction(transaction: TransactionDto) {
    const {transactionExternalId, value} = transaction;
    const status = value > 1000 ? Status.Rejected : Status.Approved;
    
    return this.clientKafka.emit('transaction-update', 
      JSON.stringify({transactionExternalId, status})
    );
  }
}
