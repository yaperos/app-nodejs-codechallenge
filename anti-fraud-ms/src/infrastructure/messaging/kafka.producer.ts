import { Inject, Injectable, type OnApplicationShutdown, type OnModuleInit } from '@nestjs/common';
import type { Kafka, Producer } from 'kafkajs';
import { KAFKA_CLIENT } from '../tokens';

export interface OutgoingMessage {
    topic: string;
    key: string;
    value: string;
    headers?: Record<string, string>;
}

@Injectable()
export class KafkaProducer implements OnModuleInit, OnApplicationShutdown {
    private readonly producer: Producer;

    constructor(@Inject(KAFKA_CLIENT) kafka: Kafka) {
        this.producer = kafka.producer({ idempotent: true, maxInFlightRequests: 1 });
    }

    async onModuleInit(): Promise<void> {
        await this.producer.connect();
    }

    async onApplicationShutdown(): Promise<void> {
        await this.producer.disconnect();
    }

    async send(message: OutgoingMessage): Promise<void> {
        await this.producer.send({
            topic: message.topic,
            acks: -1,
            messages: [{ key: message.key, value: message.value, headers: message.headers }],
        });
    }
}