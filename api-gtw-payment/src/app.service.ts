import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { CreateTransactionEvent } from './dto/transaction-created.event';
import { transactionRequest } from './dto/transaction.dto';
import { SearchTransactionEvent } from './dto/transaction-searched.event';

@Injectable()
export class AppService {
  constructor(
    @Inject('TRANSACTION_SERVICE') private readonly transactionClient: ClientKafka,
  ) {}

  createTransaction(transactionRequest: transactionRequest){
    return this.transactionClient.send('create_transaction', new CreateTransactionEvent(transactionRequest))
  }

  searchTransaction(transactionId: string){
    return this.transactionClient.send('search_transaction', new SearchTransactionEvent(transactionId))
  }
}
