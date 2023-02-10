import { Injectable, Inject } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { TransactionCreatedEvent } from './models/transaction.model';

@Injectable()
export class AntiFraudService {
  constructor(
    @Inject('KAFKA')
    private readonly kafka: ClientKafka,
  ) {}

  public handleModeration(transaction: TransactionCreatedEvent) {
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
