import { Injectable, OnModuleInit, Inject } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { CheckTransactionDto } from './check-transaction.dto';
import { TransactionStatus } from './core/contants';

@Injectable()
export class AppService {
  constructor(
    @Inject('ANTI_FRAUD_EMITTER') private readonly authClient: ClientKafka,
  ) {}
  verifyTransaction(transaction: CheckTransactionDto) {
    console.log(transaction, 'transaction');
    const { transactionExternalId, value } = transaction;
    const status =
      value > 1000 ? TransactionStatus.REJECTED : TransactionStatus.APPROVED;

    return this.authClient.emit(
      'update-transaction',
      JSON.stringify({ transactionExternalId, status }),
    );
  }
}
