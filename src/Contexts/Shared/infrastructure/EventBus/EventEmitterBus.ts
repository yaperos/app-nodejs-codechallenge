/* eslint-disable array-callback-return */
import { EventEmitter } from 'events';
import { DomainEvent } from '../../domain/DomainEvent';
import { DomainEventSubscriber } from '../../domain/DomainEventSubscriber';

export class EventEmitterBus extends EventEmitter {
  constructor(subscribers: Array<DomainEventSubscriber<DomainEvent>>) {
    super();
    this.registerSubscribers(subscribers);
  }

  registerSubscribers(subscribers?: Array<DomainEventSubscriber<DomainEvent>>): void {
    subscribers?.map((subscriber) => {
      this.registerSubscriber(subscriber);
    });
  }

  private registerSubscriber(subscriber: DomainEventSubscriber<DomainEvent>): void {
    subscriber.subscribedTo().map((event) => {
      this.on(event.EVENT_NAME, subscriber.on.bind(subscriber));
    });
  }

  publish(events: Array<DomainEvent>): void {
    events.map((event) => this.emit(event.eventName, event));
  }
}
