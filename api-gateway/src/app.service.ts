import { Inject, Injectable } from '@nestjs/common';
import { CreateTransactionRequest } from './dto/create-transaction-request.dto';
import { ClientKafka } from '@nestjs/microservices';

@Injectable()
export class AppService {
  
  private STATUS_PENDING: string = 'pending';

  constructor(
    @Inject('TRANSACTION_SERVICE') private readonly transactionClient: ClientKafka,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  createTransaction(createTransactionRequest: CreateTransactionRequest) {
    createTransactionRequest.status = this.STATUS_PENDING;
    this.transactionClient.emit('transaction_created', JSON.stringify(createTransactionRequest))
  }
}
