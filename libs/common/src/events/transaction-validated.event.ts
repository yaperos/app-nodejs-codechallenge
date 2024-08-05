import { IEvent } from '@nestjs/cqrs';
import { TransactionValidatedRequest } from '../dto/transaction-validated.dto';

export class TransactionValidatedEvent implements IEvent {
  constructor(public readonly data: TransactionValidatedRequest) {}
}
