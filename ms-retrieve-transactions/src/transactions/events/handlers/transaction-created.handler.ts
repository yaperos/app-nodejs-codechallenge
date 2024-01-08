import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { TransactionCreatedEvent } from '../transaction-created.event';
import { TransactionRepository } from 'src/transactions/repositories/transaction.repository';

@EventsHandler(TransactionCreatedEvent)
export class TransactionCreatedHandler
  implements IEventHandler<TransactionCreatedEvent>
{
  constructor(private repository: TransactionRepository) {}

  async handle(event: TransactionCreatedEvent) {
    await this.repository.createTransaction({
      transferTypeId: event.transferTypeId,
      value: event.value,
      createdAt: event.createdAt,
      transactionStatusId: event.transactionStatusId,
      transactionExternalId: event.transactionExternalId,
    });
  }
}
