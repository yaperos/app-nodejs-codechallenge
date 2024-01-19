import {
  DomainEvent,
  DomainEventPrimitives,
} from 'src/modules/shared/domain/domain-event';

type TestedDomainEventAttributes = {
  fieldString: string;
  fieldInteger: number;
};

export class TestedDomainEvent
  extends DomainEvent<TestedDomainEventAttributes>
  implements TestedDomainEventAttributes
{
  static readonly EVENT_NAME = 'event.tested';

  fieldString: string;
  fieldInteger: number;

  constructor({
    id,
    aggregateId,
    occurredOn,
    fieldString,
    fieldInteger,
  }: {
    id?: string;
    aggregateId: string;
    occurredOn?: Date;
    fieldString: string;
    fieldInteger: number;
  }) {
    super({
      id,
      aggregateId,
      occurredOn,
      eventName: TestedDomainEvent.EVENT_NAME,
    });
    this.fieldString = fieldString;
    this.fieldInteger = fieldInteger;
  }

  static fromPrimitives({
    id,
    aggregateId,
    occurredOn,
    attributes: { fieldString, fieldInteger },
  }: DomainEventPrimitives<TestedDomainEventAttributes>): TestedDomainEvent {
    return new TestedDomainEvent({
      id,
      aggregateId,
      occurredOn,
      fieldString,
      fieldInteger,
    });
  }

  toPrimitives(): DomainEventPrimitives<TestedDomainEventAttributes> {
    return {
      id: this.id,
      aggregateId: this.aggregateId,
      occurredOn: this.occurredOn,
      attributes: {
        fieldString: this.fieldString,
        fieldInteger: this.fieldInteger,
      },
    };
  }
}
