import { IEvent } from '@nestjs/cqrs';
import { TransactionStatusUpdatedRequest } from '../dto/transaction-status-updated.dto';

export class TransactionReadStatusUpdatedEvent implements IEvent {
  constructor(public readonly data: TransactionStatusUpdatedRequest) {}
}
