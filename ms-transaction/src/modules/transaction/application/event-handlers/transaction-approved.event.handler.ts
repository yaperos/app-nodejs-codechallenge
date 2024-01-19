import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { TransactionApprovedEvent } from 'src/modules/transaction/domain/events/transaction-approved.event';

import { TransactionApprovedHandler } from '../use-cases/transaction-approved-handler.use-case';

@EventsHandler(TransactionApprovedEvent)
export class TransactionApprovedEventHandler
  implements IEventHandler<TransactionApprovedEvent>
{
  constructor(private transactionApprovedHandler: TransactionApprovedHandler) {}

  async handle(event: TransactionApprovedEvent): Promise<void> {
    await this.transactionApprovedHandler.run(event);
  }
}
