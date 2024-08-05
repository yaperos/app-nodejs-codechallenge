import { EventBus, EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { TransactionValidatedRequest } from '@app/common/dto/transaction-validated.dto';
import { TransactionValidatedEvent } from '@app/common/events/transaction-validated.event';
import { StatusType, StatusTypeLabels } from '@app/common';
import { TransactionStatusUpdatedSagaEvent } from '../saga/transaction-status-updated-saga.event';

@EventsHandler(TransactionValidatedEvent)
export class TransactionValidatedHandler
  implements IEventHandler<TransactionValidatedEvent>
{
  constructor(private readonly eventBus: EventBus) {}

  async handle(event: TransactionValidatedEvent): Promise<void> {
    const data: TransactionValidatedRequest = event.data;
    const { id, value } = data;
    const { id: transactionStatusId, name: transactionStatusName } =
      this.determineTransactionStatus(value);

    const eventSaga = new TransactionStatusUpdatedSagaEvent({
      id,
      transactionStatusId,
      transactionStatusName,
    });
    this.eventBus.publish(eventSaga);
  }

  private determineTransactionStatus(value: number) {
    if (value > 1000) {
      return {
        id: StatusType.rejected,
        name: StatusTypeLabels[StatusType.rejected],
      };
    }
    return {
      id: StatusType.approved,
      name: StatusTypeLabels[StatusType.approved],
    };
  }
}
