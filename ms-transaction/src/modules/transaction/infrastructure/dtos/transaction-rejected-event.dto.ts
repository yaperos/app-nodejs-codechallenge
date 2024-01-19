import { Transform } from 'class-transformer';
import { IsString } from 'class-validator';
import { DomainEventPrimitives } from 'src/modules/shared/domain/domain-event';
import { TransactionRejectedEventAttributes } from 'src/modules/transaction/domain/events/transaction-rejected.event';

export class TransactionRejectedEventDto
  implements DomainEventPrimitives<TransactionRejectedEventAttributes>
{
  id: string;
  aggregateId: string;
  @Transform(({ value }) => new Date(value))
  @IsString()
  occurredOn: Date;
  attributes: TransactionRejectedEventAttributes;
}
