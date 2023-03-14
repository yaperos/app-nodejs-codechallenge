import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices/client';
import { CreateTransactionRequest } from './create-transaction-request.dto';
import { TransactionCreatedEvent } from './transaction-created.event';
import * as uuid from 'uuid'

@Injectable()
export class AppService {
  constructor(
    @Inject('TRANSACTION_SERVICE') private readonly transactionClient:ClientKafka
  ){}

  getHello(): string {
    return 'Hello World!';
  }

  createTransaction({accountExternalIdDebit,accountExternalIdCredit,tranferTypeId,value}:CreateTransactionRequest){
    const transactionExternalId = uuid.v4();
    const now=new Date();
    this.transactionClient.emit(
      'yapev2_transaction_created', 
      new TransactionCreatedEvent(
        transactionExternalId,
        accountExternalIdDebit,
        accountExternalIdCredit,
        tranferTypeId,
        value
      ).toString());
  }
}
