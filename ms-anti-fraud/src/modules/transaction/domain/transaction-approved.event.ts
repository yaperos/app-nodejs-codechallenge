import {
  DomainEvent,
  DomainEventPrimitives,
  DomainEventProps,
} from 'src/modules/shared/domain/domain-event';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface TransactionApprovedEventAttributes {}

type TransactionApprovedProps = DomainEventProps &
  TransactionApprovedEventAttributes;

export class TransactionApprovedEvent extends DomainEvent<TransactionApprovedEventAttributes> {
  static readonly EVENT_NAME = 'transaction.approved';

  constructor({ id, aggregateId, occurredOn }: TransactionApprovedProps) {
    super({
      id,
      aggregateId,
      eventName: TransactionApprovedEvent.EVENT_NAME,
      occurredOn,
    });
  }

  static fromPrimitives({
    id,
    aggregateId,
    occurredOn,
    attributes,
  }: DomainEventPrimitives<TransactionApprovedEventAttributes>): TransactionApprovedEvent {
    return new TransactionApprovedEvent({
      id,
      aggregateId,
      occurredOn,
      ...attributes,
    });
  }

  toPrimitives(): DomainEventPrimitives<TransactionApprovedEventAttributes> {
    return {
      id: this.id,
      aggregateId: this.aggregateId,
      occurredOn: this.occurredOn,
      attributes: {},
    };
  }
}
