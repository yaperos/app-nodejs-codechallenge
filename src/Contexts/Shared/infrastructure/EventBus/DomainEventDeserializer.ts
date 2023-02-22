/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { DomainEventClass } from '../../domain/DomainEvent';
import { DomainEventSubscribers } from './DomainEventSubscribers';

type DomainEventJSON = {
	type: string;
	aggregateId: string;
	attributes: string;
	id: string;
	occurredOn: string;
};

export class DomainEventDeserializer extends Map<string, DomainEventClass> {
	static configure(subscribers: DomainEventSubscribers) {
		const mapping = new DomainEventDeserializer();
		subscribers.items.forEach((subscriber: { subscribedTo: () => DomainEventClass[] }) => {
			subscriber.subscribedTo().forEach(mapping.registerEvent.bind(mapping));
		});

		return mapping;
	}

	deserialize(event: string) {
		const eventData = JSON.parse(event).data as DomainEventJSON;
		const { type, aggregateId, attributes, id, occurredOn } = eventData;
		const eventClass = super.get(type);

		if (!eventClass) {
			throw Error(`DomainEvent mapping not found for event ${type}`);
		}

		return eventClass.fromPrimitives({
			aggregateId,
			attributes,
			occurredOn: new Date(occurredOn),
			eventId: id
		});
	}

	private registerEvent(domainEvent: DomainEventClass) {
		const eventName = domainEvent.EVENT_NAME;
		this.set(eventName, domainEvent);
	}
}
