/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Message } from 'kafka-node';

import { DomainEvent } from '../../../domain/DomainEvent';
import { DomainEventSubscriber } from '../../../domain/DomainEventSubscriber';
import { DomainEventDeserializer } from '../DomainEventDeserializer';

export class KafkaConsumer {
	private readonly subscriber: DomainEventSubscriber<DomainEvent>;
	private readonly deserializer: DomainEventDeserializer;

	constructor(params: {
		subscriber: DomainEventSubscriber<DomainEvent>;
		deserializer: DomainEventDeserializer;
	}) {
		this.subscriber = params.subscriber;
		this.deserializer = params.deserializer;
	}

	async onMessage(message: Message) {
		const content = message.value.toString();
		const domainEvent = this.deserializer.deserialize(content);

		await this.subscriber.on(domainEvent);
	}
}
