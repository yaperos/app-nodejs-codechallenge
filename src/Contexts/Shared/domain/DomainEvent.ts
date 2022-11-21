import { UniqueEntityID } from './value-object/UniqueEntityID';

export abstract class DomainEvent {
  static EVENT_NAME: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromPrimitives: (...args: Array<any>) => DomainEvent;
  readonly eventId: any;
  readonly eventName: string;

  protected constructor(eventName: string, eventId?: string) {
    this.eventId = eventId || new UniqueEntityID().value;
    this.eventName = eventName;
  }

  abstract toPrimitive(): Record<string, any>;
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type DomainEventClass = {
  EVENT_NAME: string;
  fromPrimitives(...args: Array<any>): DomainEvent;
};