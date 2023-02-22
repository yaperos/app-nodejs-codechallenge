/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/require-await */
import { DomainEvent } from '../../../../../../../../src/Contexts/Shared/domain/DomainEvent';
import { EventBus } from '../../../../../../../../src/Contexts/Shared/domain/EventBus';
import { DomainEventSubscribers } from '../../../../../../../../src/Contexts/Shared/infrastructure/EventBus/DomainEventSubscribers';

export default class EventBusMock implements EventBus {
	private readonly publishSpy = jest.fn();

	async publish(events: DomainEvent[]) {
		this.publishSpy(events);
	}

	addSubscribers(subscribers: DomainEventSubscribers): void {}

	assertLastPublishedEventIs(expectedEvent: DomainEvent) {
		const publishSpyCalls = this.publishSpy.mock.calls;

		expect(publishSpyCalls.length).toBeGreaterThan(0);

		const lastPublishSpyCall = publishSpyCalls[publishSpyCalls.length - 1];
		const lastPublishedEvent = lastPublishSpyCall[0][0];

		const expected = this.getDataFromDomainEvent(expectedEvent);
		const published = this.getDataFromDomainEvent(lastPublishedEvent);

		expect(expected).toMatchObject(published);
	}

	private getDataFromDomainEvent(event: DomainEvent) {
		const { eventId, occurredOn, ...attributes } = event;

		return attributes;
	}
}
