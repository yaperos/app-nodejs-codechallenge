import { Uuid } from './value-object/uuid';

export interface DomainEventProps {
  id?: string;
  aggregateId: string;
  occurredOn?: Date;
}

interface DomainEventConstructorProps extends DomainEventProps {
  eventName: string;
}

export abstract class DomainEvent<T> implements DomainEventValues {
  static EVENT_NAME: string;
  static fromPrimitives: (
    params: DomainEventPrimitives<any>,
  ) => DomainEvent<any>;

  readonly id: string;
  readonly aggregateId: string;
  readonly eventName: string;
  readonly occurredOn: Date;

  constructor({
    id,
    aggregateId,
    eventName,
    occurredOn,
  }: DomainEventConstructorProps) {
    this.id = id ?? Uuid.random().value;
    this.aggregateId = aggregateId;
    this.occurredOn = occurredOn ?? new Date();
    this.eventName = eventName;
  }

  abstract toPrimitives(): DomainEventPrimitives<T>;

  toJSON() {
    return { type: this.eventName, ...this.toPrimitives() };
  }
}

export interface DomainEventValues {
  id: string;
  aggregateId: string;
  occurredOn: Date;
}

export type DomainEventPrimitives<T> = DomainEventValues & { attributes: T };
