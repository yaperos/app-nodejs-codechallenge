export abstract class DomainEvent {
  constructor(readonly eventName: string) {}

  abstract toPrimitives(): any;
}
