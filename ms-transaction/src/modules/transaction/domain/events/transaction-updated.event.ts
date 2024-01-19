import {
  DomainEvent,
  DomainEventPrimitives,
  DomainEventProps,
} from 'src/modules/shared/domain/domain-event';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface TransactionUpdatedEventAttributes {}

type TransactionUpdatedProps = DomainEventProps &
  TransactionUpdatedEventAttributes;

export class TransactionUpdatedEvent extends DomainEvent<TransactionUpdatedEventAttributes> {
  static readonly EVENT_NAME = 'transaction.updated';

  constructor({ id, aggregateId, occurredOn }: TransactionUpdatedProps) {
    super({
      id,
      aggregateId,
      eventName: TransactionUpdatedEvent.EVENT_NAME,
      occurredOn,
    });
  }

  static fromPrimitives({
    id,
    aggregateId,
    occurredOn,
    attributes,
  }: DomainEventPrimitives<TransactionUpdatedEventAttributes>): TransactionUpdatedEvent {
    return new TransactionUpdatedEvent({
      id,
      aggregateId,
      occurredOn,
      ...attributes,
    });
  }

  toPrimitives(): DomainEventPrimitives<TransactionUpdatedEventAttributes> {
    return {
      id: this.id,
      aggregateId: this.aggregateId,
      occurredOn: this.occurredOn,
      attributes: {},
    };
  }
}
