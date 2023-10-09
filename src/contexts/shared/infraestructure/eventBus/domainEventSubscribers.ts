import { DomainEvent } from '../../domain/domainEvent';
import { DomainEventSubscriber } from '../../domain/domainEventSubscriber';

export class DomainEventSubscribers {
	constructor(public items: Array<DomainEventSubscriber<DomainEvent>>) {}
}
