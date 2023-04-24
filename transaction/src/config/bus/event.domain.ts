import { getUnixTime } from 'date-fns';

export abstract class EventDomain {
  abstract readonly entityType: string;
  abstract readonly eventType: string;

  abstract readonly topic: string;
  protected createdAt: Date = new Date();

  protected constructor(
    readonly eventId: string,
    readonly entityId: any,
    readonly commerce: string,
    readonly channel: string,
  ) {
  }

  abstract getData(): Object;

  getAttributes(): Attributes {
    return {
      eventId: `${this.eventId}`,
      eventType: `${this.eventType}`,
      entityId: `${this.entityId}`,
      entityType: `${this.entityType}`,
      timestamp: `${getUnixTime(this.createdAt)}`,
      datetime: `${this.createdAt.toISOString()}`,
      commerce: this.commerce,
      channel: this.channel
    };
  }
}

export interface EventAttributes {
  commerce: string;
  eventId: string;
  entityId: string;
  channel: string;
}

interface Attributes {
  [key: string]: string;
}
