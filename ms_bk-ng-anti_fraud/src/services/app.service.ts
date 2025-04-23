import { Injectable } from '@nestjs/common';
import { TRANSACTION_STATUS } from 'src/config/transaction';
import { EventStoreService } from 'src/events/event-store';

@Injectable()
export class AppService {
  constructor(private readonly eventStore: EventStoreService) {}

  validateTransaction(transaction: any) {
    console.log({ transaction });
    console.log('Validating transaction:', transaction);

    const { value } = transaction;

    let status = TRANSACTION_STATUS.APPROVED;

    if (value > 1000) {
      status = TRANSACTION_STATUS.REJECTED;
    }

    this.eventStore.appendEvent('transaction.validated', transaction.id, {
      id: transaction.id,
      status,
    });
  }
}
