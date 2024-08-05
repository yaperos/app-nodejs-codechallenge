import { IEvent } from '@nestjs/cqrs';
import { TransactionCreatedRequest } from '../dto/transaction-created.dto';

export class TransactionCreatedEvent implements IEvent {
  constructor(public readonly data: TransactionCreatedRequest) {}
}
