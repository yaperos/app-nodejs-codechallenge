import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { TransactionCreatedEvent } from './events/transaction-created.event';
import { TransactionUpdatedEvent } from './events/transaction-updated.event';
import { TransactionStatus } from './constants/transaction-status.enum';

@Injectable()
export class AppService {

  constructor(
    @Inject('TRANSACTION_SERVICE') private readonly transactionClient: ClientKafka,
  ) { }
  
  handleOrderCreated({ transactionExternalId, amount }: TransactionCreatedEvent) {
    console.log('fraud', {amount})
    return this.transactionClient.emit(
      'transaction_updated',
      new TransactionUpdatedEvent(transactionExternalId, amount > 1000? TransactionStatus.REJECTED : TransactionStatus.APPROVED),
    )
  }
}
