import { IEvent } from '@nestjs/cqrs';
import { Expose } from 'class-transformer';

export class TransactionCreatedEvent implements IEvent {
  @Expose()
  transactionExternalId: string;

  @Expose()
  value: number;

  @Expose()
  transferTypeId: number;

  @Expose()
  transactionStatusId: number;

  @Expose()
  createdAt: Date;
}
