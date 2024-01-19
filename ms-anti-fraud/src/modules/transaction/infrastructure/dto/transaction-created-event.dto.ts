import { Transform } from 'class-transformer';
import { IsString } from 'class-validator';
import { DomainEventPrimitives } from 'src/modules/shared/domain/domain-event';
import { TransactionCreatedEventAttributes } from 'src/modules/transaction/domain/transaction-created.event';

export class TransactionCreatedEventDto
  implements DomainEventPrimitives<TransactionCreatedEventAttributes>
{
  id: string;
  aggregateId: string;
  @Transform(({ value }) => new Date(value))
  @IsString()
  occurredOn: Date;
  attributes: TransactionCreatedEventAttributes;
}
