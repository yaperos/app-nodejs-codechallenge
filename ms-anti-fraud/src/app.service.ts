import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { TransactionType } from './enum/transaction-type';
import { EventType } from './enum/event-type';
import { isRejected } from './utils/validation';

@Injectable()
export class AppService {
  constructor(
    @Inject('TRANSACTION_SERVICE')
    private readonly transactionClient: ClientKafka,
  ) {}

  validateTransaction(data: any) {
    const { id, value } = data;
    const transactionStatus = isRejected(value)
      ? TransactionType.REJECTED
      : TransactionType.APPROVED;

    this.transactionClient.emit(
      'transaction_queue',
      JSON.stringify({
        type: EventType.UPDATE,
        params: {
          id,
          transactionStatus: transactionStatus,
        },
      }),
    );
  }
}
