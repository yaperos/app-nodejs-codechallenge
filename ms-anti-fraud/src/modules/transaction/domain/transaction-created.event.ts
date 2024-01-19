import {
  DomainEvent,
  DomainEventPrimitives,
  DomainEventProps,
} from 'src/modules/shared/domain/domain-event';

export interface TransactionCreatedEventAttributes {
  amount: number;
}

type TransactionCreatedProps = DomainEventProps &
  TransactionCreatedEventAttributes;

export class TransactionCreatedEvent
  extends DomainEvent<TransactionCreatedEventAttributes>
  implements TransactionCreatedEventAttributes
{
  static readonly EVENT_NAME = 'transaction.created';

  readonly amount: number;

  constructor({
    id,
    aggregateId,
    occurredOn,
    amount,
  }: TransactionCreatedProps) {
    super({
      id,
      aggregateId,
      eventName: TransactionCreatedEvent.EVENT_NAME,
      occurredOn,
    });
    this.amount = amount;
  }

  static fromPrimitives({
    id,
    aggregateId,
    occurredOn,
    attributes,
  }: DomainEventPrimitives<TransactionCreatedEventAttributes>): TransactionCreatedEvent {
    return new TransactionCreatedEvent({
      id,
      aggregateId,
      occurredOn,
      ...attributes,
    });
  }

  toPrimitives(): DomainEventPrimitives<TransactionCreatedEventAttributes> {
    return {
      id: this.id,
      aggregateId: this.aggregateId,
      occurredOn: this.occurredOn,
      attributes: { amount: this.amount },
    };
  }
}
