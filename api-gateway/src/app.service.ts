import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { CreateTransactionRequest } from './transaction.dto';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AppService implements OnModuleInit {
  constructor(
    @Inject('TRANSACTION_SERVICE') private readonly transactionClient: ClientKafka
  ) {}

  onModuleInit() {
    this.transactionClient.subscribeToResponseOf('transaction_created');
  }

  createTransaction(
    params: CreateTransactionRequest
  ) {
    const response = this.transactionClient.send('transaction_created', JSON.stringify(params));

    return firstValueFrom(response);
  }
}
