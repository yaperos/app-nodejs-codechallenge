import { Injectable, Logger } from '@nestjs/common';
import { TRANSACTION_STATUS } from 'src/config/contants/transaction';
import { EventStoreService } from 'src/events/event-store';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  constructor(private readonly eventStore: EventStoreService) {}

  validateTransaction(transaction: any) {
    this.logger.log('Validating transaction:', transaction);

    const { value } = transaction;

    let status = TRANSACTION_STATUS.APPROVED;

    if (value > 1000) {
      status = TRANSACTION_STATUS.REJECTED;
    }

    this.eventStore.onTransactionValidatedEvent({
      id: transaction.id,
      status,
    });
  }
}
