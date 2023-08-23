import { Subject } from 'rxjs';
import { IEvent, IEventPublisher, IMessageSource } from '../interfaces';
export declare class DefaultPubSub<EventBase extends IEvent> implements IEventPublisher<EventBase>, IMessageSource<EventBase> {
    private subject$;
    constructor(subject$: Subject<EventBase>);
    publish<T extends EventBase>(event: T): void;
    bridgeEventsTo<T extends EventBase>(subject: Subject<T>): void;
}
