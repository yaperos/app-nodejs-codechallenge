import { Inject, Injectable, Logger } from '@nestjs/common';
import { EVENT_BUS, EventBus } from '@app/common';
import {
  TransactionCreated,
  TransactionStatusValidadedEvent,
} from '../domain/events';
import { Transaction } from '../domain/antifraud-transaction.entity';

@Injectable()
export class TransactionsService {
  private readonly logger = new Logger(TransactionsService.name);

  constructor(@Inject(EVENT_BUS) private eventBus: EventBus) {}

  validateTransaction(event: TransactionCreated) {
    const transaction = new Transaction(event.id, event.amount);
    transaction.validateAmount();

    this.logger.debug(
      'Emitting event "transaction.status.validated" with body',
      transaction.toPrimitives(),
    );

    return this.eventBus.publish(
      new TransactionStatusValidadedEvent(transaction.id, transaction.status),
    );
  }
}
