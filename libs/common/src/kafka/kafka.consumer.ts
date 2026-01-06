import { Inject, Injectable, type OnModuleDestroy, type OnModuleInit } from '@nestjs/common';
import type { Consumer, EachMessagePayload } from 'kafkajs';
import { createKafkaClient, type KafkaModuleOptions } from './kafka.config';
import { KAFKA_OPTIONS } from './kafka.constants';

export type MessageHandler = (payload: EachMessagePayload) => Promise<void>;

@Injectable()
export class KafkaConsumerService implements OnModuleInit, OnModuleDestroy {
    private consumer: Consumer;
    private messageHandlers: Map<string, MessageHandler> = new Map();

    constructor(
        @Inject(KAFKA_OPTIONS)
        private readonly options: KafkaModuleOptions,
    ) {
        const kafka = createKafkaClient(this.options);
        if (!this.options.consumerConfig) {
            throw new Error('consumerConfig is required for KafkaConsumerService');
        }
        this.consumer = kafka.consumer(this.options.consumerConfig);
    }

    async onModuleInit() {
        await this.consumer.connect();
        console.log(`✅ Kafka Consumer connected (${this.options.clientId})`);

        if (this.messageHandlers.size > 0) {
            await this.startConsuming();
        }
    }

    async onModuleDestroy() {
        await this.consumer.disconnect();
        console.log(`❌ Kafka Consumer disconnected (${this.options.clientId})`);
    }

    registerHandler(topic: string, handler: MessageHandler): void {
        this.messageHandlers.set(topic, handler);
    }

    async subscribe(topics: string[]): Promise<void> {
        for (const topic of topics) {
            await this.consumer.subscribe({ topic, fromBeginning: false });
            console.log(`📥 Subscribed to topic: ${topic}`);
        }
    }

    private async startConsuming(): Promise<void> {
        await this.consumer.run({
            eachMessage: async (payload: EachMessagePayload) => {
                const handler = this.messageHandlers.get(payload.topic);
                if (handler) {
                    await handler(payload);
                } else {
                    console.warn(`No handler registered for topic: ${payload.topic}`);
                }
            },
        });
    }

    async subscribeAndRun(topics: string[]): Promise<void> {
        await this.subscribe(topics);
        await this.startConsuming();
    }
}
