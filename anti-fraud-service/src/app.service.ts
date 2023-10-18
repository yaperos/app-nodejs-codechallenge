import { Inject, Injectable } from '@nestjs/common';
import { TransactionCreatedEvent } from './event/transaction-created.event';
import { ClientKafka } from '@nestjs/microservices';
import { type } from 'os';

@Injectable()
export class AppService {

  constructor(
    @Inject('TRANSACTION_SERVICE') private readonly transactionClient: ClientKafka,
  ) {}

  private MAX_VALUE:number = 1000;

  getHello(): string {
    return 'Hello World!';
  }

  handleTransactionPending(data: TransactionCreatedEvent) {
    const { accountExternalIdDebit, accountExternalIdCredit, tranferTypeId, value } = data;
    let status = 'approved';
    if (value > this.MAX_VALUE) 
      status = 'rejected';  
    this.transactionClient.emit('transaction_updated', new TransactionCreatedEvent(accountExternalIdDebit, accountExternalIdCredit, tranferTypeId, value, status)))
  }
}
