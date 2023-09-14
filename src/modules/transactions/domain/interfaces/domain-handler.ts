/* eslint-disable @typescript-eslint/no-unused-vars */
import { IDomainEvent } from './domain-event';

export interface IHandle<IDomainEvent> {
  setupSubscriptions(): void;
}
