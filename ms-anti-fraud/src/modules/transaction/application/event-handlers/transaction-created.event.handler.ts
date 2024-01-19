import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { TransactionCreatedEvent } from 'src/modules/transaction/domain/transaction-created.event';

import { TransactionCreatedHandler } from '../use-cases/transaction-created-handler.use-case';

@EventsHandler(TransactionCreatedEvent)
export class TransactionCreatedEventHandler
  implements IEventHandler<TransactionCreatedEvent>
{
  constructor(private transactionCreatedHandler: TransactionCreatedHandler) {}

  async handle(event: TransactionCreatedEvent): Promise<void> {
    await this.transactionCreatedHandler.run(event);
  }
}
