/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { DomainEvent } from '../../domain/DomainEvent';

export class DomainEventJsonSerializer {
	static serialize(event: DomainEvent): string {
		return JSON.stringify({
			data: {
				id: event.eventId,
				type: event.eventName,
				occurredOn: event.occurredOn.toISOString(),
				aggregateId: event.aggregateId,
				attributes: event.toPrimitives()
			}
		});
	}
}
