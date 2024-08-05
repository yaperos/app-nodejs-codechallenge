import { TransactionCreatedRequest } from '@app/common/dto/transaction-created.dto';
import { IEvent } from '@nestjs/cqrs';

export class TransactionCreatedSagaEvent implements IEvent {
  constructor(public readonly data: TransactionCreatedRequest) {}
}
