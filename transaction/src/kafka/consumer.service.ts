import { Injectable, OnApplicationShutdown } from '@nestjs/common';
import { Consumer, Kafka, ConsumerSubscribeTopics, ConsumerRunConfig } from 'kafkajs';

@Injectable()
export class ConsumerService implements OnApplicationShutdown {
	private readonly kafka = new Kafka({
		brokers: [process.env.KAFKA_BROKER],
	});
	private readonly consumers: Consumer[] = [];

	public async consume(topic: ConsumerSubscribeTopics, config: ConsumerRunConfig): Promise<void> {
		const consumer = this.kafka.consumer({ groupId: 'nestjs-kafka' });
		await consumer.connect();
		await consumer.subscribe(topic);
		await consumer.run(config);
		this.consumers.push(consumer);
	}

	public async onApplicationShutdown(): Promise<void> {
		for (const consumer of this.consumers) {
			await consumer.disconnect();
		}
	}
}
