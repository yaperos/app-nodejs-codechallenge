import { DomainEvent } from './domain-event';

export const EVENT_BUS = 'EventBus';

export interface EventBus {
  publish(event: DomainEvent): Promise<void>;
}
