import { DomainEvent } from '../../../domain/domainEvent';
import { EventBus } from '../../../domain/eventBus';
import { DomainEventDeserializer } from '../domainEventDeserializer';
import { DomainEventJsonSerializer } from '../domainEventJsonSerializer';
import { DomainEventSubscribers } from '../domainEventSubscribers';
import { KafkaConnection } from './kafkaConnection';
import { KafkaConsumerFactory } from './kafkaConsumerFactory';

export class KafkaEventBus implements EventBus {
	private readonly connection: KafkaConnection;
	private readonly publisherTopic: string;
	private readonly consumerTopic: string;

	constructor(params: {
		connection: KafkaConnection;
		consumerTopic: string;
		publisherTopic: string;
	}) {
		const { connection, consumerTopic, publisherTopic } = params;
		this.connection = connection;
		this.consumerTopic = consumerTopic;
		this.publisherTopic = publisherTopic;
	}

	async addSubscribers(subscribers: DomainEventSubscribers): Promise<void> {
		const deserializer = DomainEventDeserializer.configure(subscribers);
		const consumerFactory = new KafkaConsumerFactory(deserializer);
		for (const subscriber of subscribers.items) {
			const kafkaConsumer = consumerFactory.build(subscriber);

			this.connection.consume(this.consumerTopic, kafkaConsumer.onMessage.bind(kafkaConsumer));
		}
	}

	async publish(events: Array<DomainEvent>): Promise<void> {
		for (const event of events) {
			const message = this.toBuffer(event);
			await this.connection.publish({ topic: this.publisherTopic, message });
		}
	}

	private toBuffer(event: DomainEvent): Buffer {
		const eventPrimitives = DomainEventJsonSerializer.serialize(event);

		return Buffer.from(eventPrimitives);
	}
}
