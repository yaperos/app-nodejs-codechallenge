import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { IncomingTransactionDto } from './incoming-transaction.dto';
import { TransactionStatus } from './app.constants';

@Injectable()
export class AppService {
  constructor(
    @Inject('TRANSACTION_SERVICE')
    private readonly transactionService: ClientKafka,
  ) {}

  verifyTransaction({ transactionExternalId, value }: IncomingTransactionDto) {
    const status =
      value > 1000 ? TransactionStatus.REJECTED : TransactionStatus.APPROVED;

    this.transactionService.emit(
      'transaction_verified',
      JSON.stringify({ transactionExternalId, status }),
    );
    return status;
  }
}
