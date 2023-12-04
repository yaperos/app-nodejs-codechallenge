import { Injectable, OnModuleInit } from '@nestjs/common';
import { Kafka, Producer, ProducerRecord } from 'kafkajs';

@Injectable()
export class ProducerService implements OnModuleInit {
	private readonly kafka = new Kafka({
		brokers: ['localhost:9092'],
	});
	private readonly producer: Producer = this.kafka.producer();

	public async onModuleInit(): Promise<void> {
		await this.producer.connect();
	}

	public async produce(record: ProducerRecord): Promise<void> {
		await this.producer.send(record);
	}

	public async onApplicationShutdown(): Promise<void> {
		await this.producer.disconnect();
	}
}
