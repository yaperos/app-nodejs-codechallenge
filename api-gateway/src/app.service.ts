import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices'
import { CreateTransactionRequest } from './requests/create-transaction-request.dto';
import { TransactionCreatedEvent } from './events/transaction-created.event';

@Injectable()
export class AppService {
  constructor(@Inject('TRANSACTION_SERVICE') private readonly transactionClient: ClientKafka) { }

  getHello(): string {
    return 'Hello World!';
  }

  createTransaction({ accountExternalIdCredit, accountExternalIdDebit, tranferTypeId, value }: CreateTransactionRequest) {
    const transaction = new TransactionCreatedEvent(accountExternalIdDebit, accountExternalIdCredit, tranferTypeId, value)
    this.transactionClient.emit('transaction-created', transaction.toString());
  }
}
