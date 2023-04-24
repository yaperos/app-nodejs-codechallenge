import { EventDomain } from './event.domain';

export abstract class EventBus {
  abstract emit(event: EventDomain): Promise<any>;
}
