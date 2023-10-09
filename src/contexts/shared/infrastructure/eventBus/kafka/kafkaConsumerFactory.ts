import { DomainEvent } from '../../../domain/domainEvent';
import { DomainEventSubscriber } from '../../../domain/domainEventSubscriber';
import { DomainEventDeserializer } from '../domainEventDeserializer';
import { KafkaConsumer } from './kafkaConsumer';

export class KafkaConsumerFactory {
	constructor(private readonly deserializer: DomainEventDeserializer) {}

	build(subscriber: DomainEventSubscriber<DomainEvent>) {
		return new KafkaConsumer({
			subscriber,
			deserializer: this.deserializer
		});
	}
}
