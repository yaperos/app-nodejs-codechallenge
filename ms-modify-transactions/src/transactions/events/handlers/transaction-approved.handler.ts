import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { TransactionRepository } from 'src/transactions/repositories/transaction.repository';
import { TransactionApprovedEvent } from '../transaction-approved.event';
import { TransactionStatusEnum } from 'src/utils/constants';

@EventsHandler(TransactionApprovedEvent)
export class TransactionApprovedHandler
  implements IEventHandler<TransactionApprovedEvent>
{
  constructor(private repository: TransactionRepository) {}

  async handle(event: TransactionApprovedEvent) {
    await this.repository.updateTransaction(
      { transactionStatusId: TransactionStatusEnum.Approved },
      event.transactionExternalId,
    );
  }
}
