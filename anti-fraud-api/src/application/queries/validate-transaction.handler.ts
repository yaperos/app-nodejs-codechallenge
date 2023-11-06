import { QueryHandler, IQueryHandler, EventBus } from '@nestjs/cqrs';
import { ValidateTransactionQuery } from './validate-transaction.query';
import { TransactionApprovedEvent } from 'src/domain/events/transaction-approved.event';
import { TransactionRejectedEvent } from 'src/domain/events/transaction-rejected.event';

@QueryHandler(ValidateTransactionQuery)
export class ValidateTransactionHandler
  implements IQueryHandler<ValidateTransactionQuery, void>
{
  constructor(private readonly eventBus: EventBus) {}

  async execute(query: ValidateTransactionQuery): Promise<void> {
    if (query.value > 1000) {
      await this.eventBus.publish(
        new TransactionRejectedEvent(query.transactionId),
      );
      return;
    }
    await this.eventBus.publish(
      new TransactionApprovedEvent(query.transactionId),
    );
  }
}
