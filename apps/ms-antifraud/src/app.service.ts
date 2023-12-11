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
    if (value > 1000) {
      this.transactionService.emit(
        'transaction_reject',
        JSON.stringify({
          transactionExternalId,
          status: TransactionStatus.REJECTED,
        }),
      );
      return TransactionStatus.REJECTED;
    }

    this.transactionService.emit(
      'transaction_approved',
      JSON.stringify({
        transactionExternalId,
        status: TransactionStatus.APPROVED,
      }),
    );
    return TransactionStatus.APPROVED;
  }
}
