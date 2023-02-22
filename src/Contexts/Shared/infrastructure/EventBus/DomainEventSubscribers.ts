import { DomainEvent } from '../../domain/DomainEvent';
import { DomainEventSubscriber } from '../../domain/DomainEventSubscriber';

export class DomainEventSubscribers {
	constructor(public items: Array<DomainEventSubscriber<DomainEvent>>) {}
}
