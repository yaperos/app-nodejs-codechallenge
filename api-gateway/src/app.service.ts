import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { CreateTransactionRequest } from './dto/create-transaction-request.dto';
@Injectable()
export class AppService {
  constructor(
    @Inject('TRANSACTION_MICROSERVICE')
    private readonly transactionClient: ClientKafka,
  ) {}

  getHello(): string {
    return 'Hello Yape!';
  }

  createTransaction(createTransactionDto: CreateTransactionRequest) {
    this.transactionClient.emit(
      'create_transaction',
      JSON.stringify(createTransactionDto),
    );
  }

  getTransaction(transactionExternalId: string) {
    return this.transactionClient.send(
      'get_transaction',
      transactionExternalId,
    );
  }

  async onModuleInit() {
    this.transactionClient.subscribeToResponseOf('get_transaction');
  }
}
