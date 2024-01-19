import { Transform } from 'class-transformer';
import { IsString } from 'class-validator';
import { DomainEventPrimitives } from 'src/modules/shared/domain/domain-event';
import { TransactionApprovedEventAttributes } from 'src/modules/transaction/domain/events/transaction-approved.event';

export class TransactionApprovedEventDto
  implements DomainEventPrimitives<TransactionApprovedEventAttributes>
{
  id: string;
  aggregateId: string;
  @Transform(({ value }) => new Date(value))
  @IsString()
  occurredOn: Date;
  attributes: TransactionApprovedEventAttributes;
}
