import { Inject } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { Transaction } from 'src/entities/transaction';

export class TransactionEvent {
  constructor(
    @Inject('ANTI-FRAUD_SERVICE')
    private readonly transactionClient: ClientKafka,
  ) {}

  public created(transaction: Transaction) {
    this.transactionClient.emit(
      'transaction_created',
      JSON.stringify({
        transactionExternalId: transaction.transactionExternalId,
        value: transaction.value,
      }),
    );
  }
}
