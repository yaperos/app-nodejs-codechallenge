/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable no-await-in-loop */
import { DomainEvent } from '../../../domain/DomainEvent';
import { EventBus } from '../../../domain/EventBus';
import { DomainEventDeserializer } from '../DomainEventDeserializer';
import { DomainEventJsonSerializer } from '../DomainEventJsonSerializer';
import { DomainEventSubscribers } from '../DomainEventSubscribers';
import { KafkaConnection } from './KafkaConnection';
import { KafkaConsumerFactory } from './KafkaConsumerFactory';
// import { KafkaTopicFormatter } from './KafkaTopicFormatter';

export class KafkaEventBus implements EventBus {
	private readonly connection: KafkaConnection;
	private readonly publisherTopic: string;
	private readonly consumerTopic: string;
	// private readonly topicFormatter: KafkaTopicFormatter;

	constructor(params: {
		connection: KafkaConnection;
		// topicFormatter: KafkaTopicFormatter;
		consumerTopic: string;
		publisherTopic: string;
	}) {
		const { connection, consumerTopic, publisherTopic } = params;
		this.connection = connection;
		this.consumerTopic = consumerTopic;
		this.publisherTopic = publisherTopic;
		// this.topicFormatter = topicFormatter;
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
