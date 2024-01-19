import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { TransactionRejectedEvent } from 'src/modules/transaction/domain/events/transaction-rejected.event';

import { TransactionRejectedHandler } from '../use-cases/transaction-rejected-handler.use-case';

@EventsHandler(TransactionRejectedEvent)
export class TransactionRejectedEventHandler
  implements IEventHandler<TransactionRejectedEvent>
{
  constructor(private transactionRejectedHandler: TransactionRejectedHandler) {}

  async handle(event: TransactionRejectedEvent): Promise<void> {
    await this.transactionRejectedHandler.run(event);
  }
}
