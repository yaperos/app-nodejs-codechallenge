import { DomainEvent } from '../../../../../../../../src/contexts/shared/domain/domainEvent';
import { EventBus } from '../../../../../../../../src/contexts/shared/domain/eventBus';
import { DomainEventSubscribers } from '../../../../../../../../src/contexts/shared/infrastructure/eventBus/domainEventSubscribers';

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
