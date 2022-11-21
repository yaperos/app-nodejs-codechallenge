import { DomainEvent } from '../../domain/DomainEvent';

export class DomainEventJsonSerializer {
  static serialize(event: DomainEvent): string {
    return JSON.stringify({
      eventId: event.eventId,
      data: event.toPrimitive(),
    });
  }
}
