import { IEvent } from '@nestjs/cqrs';

export class TransactionApprovedEvent implements IEvent {
  transactionExternalId: string;

  value: number;
}
