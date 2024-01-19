import { DomainEvent } from './domain-event';

export abstract class AggregateRoot {
  private domainEvents: Array<DomainEvent<any>>;

  constructor() {
    this.domainEvents = [];
  }

  pullDomainEvents(): Array<DomainEvent<any>> {
    const domainEvents = this.domainEvents.slice();
    this.domainEvents = [];

    return domainEvents;
  }

  recordEvent(event: DomainEvent<any>): void {
    this.domainEvents.push(event);
  }

  abstract getId(): string;

  abstract toPrimitives(): any;
}
