import { TransactionStatusUpdatedRequest } from '@app/common/dto/transaction-status-updated.dto';
import { IEvent } from '@nestjs/cqrs';

export class TransactionStatusUpdatedSagaEvent implements IEvent {
  constructor(public readonly data: TransactionStatusUpdatedRequest) {}
}
