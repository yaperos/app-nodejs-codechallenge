/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { DomainEvent } from '../../../domain/DomainEvent';
import { DomainEventSubscriber } from '../../../domain/DomainEventSubscriber';

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
