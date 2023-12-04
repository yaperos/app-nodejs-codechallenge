import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConsumerService } from './kafka/consumer.service';

@Injectable()
export class AntiFraudConsumer implements OnModuleInit {
	constructor(private readonly consumerService: ConsumerService) {}

	public async onModuleInit(): Promise<void> {
		await this.consumerService.consume(
			{ topics: ['anti-fraud'] },
			{
				eachMessage: async ({ topic, partition, message }) => {
					const messageJson = JSON.parse(message.value.toString());
					console.log({
						value: messageJson,
						topic: topic.toString(),
						partition: partition.toString(),
					});
				},
			},
		);
	}
}
