import { Inject, Injectable } from '@nestjs/common';
import { CreateTransactionRequest } from './dto/create-transaction-request.dto';
import { ClientKafka } from '@nestjs/microservices';

@Injectable()
export class AppService {
  
  constructor(
    @Inject('TRANSACTION_SERVICE') private readonly transactionClient: ClientKafka,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  createTransaction(createTransactionRequest: CreateTransactionRequest) {
    this.transactionClient.emit('transaction_created', JSON.stringify(createTransactionRequest))
  }
}
