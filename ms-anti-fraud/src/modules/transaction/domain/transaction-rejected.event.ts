import {
  DomainEvent,
  DomainEventPrimitives,
  DomainEventProps,
} from 'src/modules/shared/domain/domain-event';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface TransactionRejectedEventAttributes {}

type TransactionRejectedProps = DomainEventProps &
  TransactionRejectedEventAttributes;

export class TransactionRejectedEvent extends DomainEvent<TransactionRejectedEventAttributes> {
  static readonly EVENT_NAME = 'transaction.rejected';

  constructor({ id, aggregateId, occurredOn }: TransactionRejectedProps) {
    super({
      id,
      aggregateId,
      eventName: TransactionRejectedEvent.EVENT_NAME,
      occurredOn,
    });
  }

  static fromPrimitives({
    id,
    aggregateId,
    occurredOn,
    attributes,
  }: DomainEventPrimitives<TransactionRejectedEventAttributes>): TransactionRejectedEvent {
    return new TransactionRejectedEvent({
      id,
      aggregateId,
      occurredOn,
      ...attributes,
    });
  }

  toPrimitives(): DomainEventPrimitives<TransactionRejectedEventAttributes> {
    return {
      id: this.id,
      aggregateId: this.aggregateId,
      occurredOn: this.occurredOn,
      attributes: {},
    };
  }
}
