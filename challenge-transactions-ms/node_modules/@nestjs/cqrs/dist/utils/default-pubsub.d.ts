import { Subject } from 'rxjs';
import { IEvent } from '../interfaces';
import { IEventPublisher } from '../interfaces/events/event-publisher.interface';
import { IMessageSource } from '../interfaces/events/message-source.interface';
export declare class DefaultPubSub implements IEventPublisher, IMessageSource {
  private subject$;
  publish<T extends IEvent>(event: T): void;
  bridgeEventsTo<T extends IEvent>(subject: Subject<T>): void;
}
