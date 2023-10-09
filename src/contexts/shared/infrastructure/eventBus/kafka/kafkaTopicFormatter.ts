import { DomainEvent } from '../../../domain/domainEvent';
import { DomainEventSubscriber } from '../../../domain/domainEventSubscriber';

export class KafkaTopicFormatter {
	constructor(private readonly moduleName: string) {}

	format(subscriber: DomainEventSubscriber<DomainEvent>) {
		const value = subscriber.constructor.name;
		const name = value
			.split(/(?=[A-Z])/)
			.join('_')
			.toLowerCase();

		return `${this.moduleName}.${name}`;
	}
}
