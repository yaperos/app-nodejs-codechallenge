import { DomainEvent } from './DomainEvent';

export class GenericEvent extends DomainEvent {
  readonly data: Record<string, any>;

  constructor(name: string, data: Record<string, any>) {
    super(name);
    this.data = data;
  }

  toPrimitive(): Record<string, any> {
    return this.data;
  }

  isPublic(): boolean {
    return true;
  }
}
