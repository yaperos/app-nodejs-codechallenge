import { Injectable, Inject } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { Transaction } from './models/transaction.model';

@Injectable()
export class AntiFraudService {
  constructor(
    @Inject('KAFKA')
    private readonly kafka: ClientKafka,
  ) {}

  public handleModeration(transaction: Transaction) {
    let status = 'approved';

    if (Number.parseFloat(transaction.value) > 1000) status = 'rejected';

    this.kafka.emit('transaction_moderated', {
      value: {
        id: transaction.id,
        status,
      },
    });
  }
}
