import { IEvent } from '@nestjs/cqrs';

export class TransactionRejectedEvent implements IEvent {
  transactionExternalId: string;

  value: number;
}
