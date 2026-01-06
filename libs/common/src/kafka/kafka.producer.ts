import { Inject, Injectable, type OnModuleDestroy, type OnModuleInit } from '@nestjs/common';
import type { Producer, ProducerRecord } from 'kafkajs';
import { createKafkaClient, type KafkaModuleOptions } from './kafka.config';
import { KAFKA_OPTIONS } from './kafka.constants';

@Injectable()
export class KafkaProducerService implements OnModuleInit, OnModuleDestroy {
    private producer: Producer;

    constructor(
        @Inject(KAFKA_OPTIONS)
        private readonly options: KafkaModuleOptions,
    ) {
        const kafka = createKafkaClient(this.options);
        this.producer = kafka.producer(this.options.producerConfig);
    }

    async onModuleInit() {
        await this.producer.connect();
        console.log(`✅ Kafka Producer connected (${this.options.clientId})`);
    }

    async onModuleDestroy() {
        await this.producer.disconnect();
        console.log(`❌ Kafka Producer disconnected (${this.options.clientId})`);
    }

    async send(record: ProducerRecord): Promise<void> {
        await this.producer.send(record);
    }

    async sendMessage<T = any>(topic: string, key: string, value: T): Promise<void> {
        await this.producer.send({
            topic,
            messages: [
                {
                    key,
                    value: JSON.stringify(value),
                },
            ],
        });
    }
}
