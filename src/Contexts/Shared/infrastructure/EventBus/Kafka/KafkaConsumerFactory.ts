/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { DomainEvent } from '../../../domain/DomainEvent';
import { DomainEventSubscriber } from '../../../domain/DomainEventSubscriber';
import { DomainEventDeserializer } from '../DomainEventDeserializer';
import { KafkaConsumer } from './KafkaConsumer';

export class KafkaConsumerFactory {
	constructor(private readonly deserializer: DomainEventDeserializer) {}

	build(subscriber: DomainEventSubscriber<DomainEvent>) {
		return new KafkaConsumer({
			subscriber,
			deserializer: this.deserializer
		});
	}
}
