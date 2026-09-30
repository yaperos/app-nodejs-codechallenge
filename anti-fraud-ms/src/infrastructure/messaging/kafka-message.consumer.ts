import { Inject, Injectable, Logger, type OnApplicationShutdown } from '@nestjs/common';
import { ExponentialBackoff, handleWhen, retry } from 'cockatiel';
import type { Consumer, Kafka, KafkaMessage } from 'kafkajs';
import { PoisonMessageError } from '../../application/errors/poison-message.error';
import {
    type ConsumedMessage,
    MessageConsumerPort,
    type SubscribeOptions,
} from '../../application/ports/message-consumer.port';
import { KAFKA_CLIENT } from '../tokens';
import { DeadLetterPublisher } from './dead-letter.publisher';

@Injectable()
export class KafkaMessageConsumer extends MessageConsumerPort implements OnApplicationShutdown {
    private readonly logger = new Logger(KafkaMessageConsumer.name);
    private readonly consumers: Consumer[] = [];

    // Solo se reintentan fallos transitorios (Kafka caído, timeouts).
    // Un mensaje inválido no mejora reintentando: va directo al DLQ.
    private readonly retryPolicy = retry(
        handleWhen((error) => !(error instanceof PoisonMessageError)),
        { maxAttempts: 4, backoff: new ExponentialBackoff({ initialDelay: 300, maxDelay: 5_000 }) },
    );

    constructor(
        @Inject(KAFKA_CLIENT) private readonly kafka: Kafka,
        private readonly deadLetter: DeadLetterPublisher,
    ) {
        super();
    }

    async subscribe(options: SubscribeOptions): Promise<void> {
        const consumer = this.kafka.consumer({ groupId: options.groupId });
        this.consumers.push(consumer);

        await consumer.connect();

        await consumer.subscribe({ topic: options.topic, fromBeginning: true });
        await consumer.run({
            eachMessage: async ({ topic, message }) => {
                const consumed = this.toConsumed(topic, message);
                try {
                    await this.retryPolicy.execute(() => options.handler(consumed));
                } catch (error) {
                    await this.deadLetter.publish({ consumerGroup: options.groupId, message: consumed, error });
                }
            },
        });
        this.logger.log(`Subscribed to ${options.topic} (group ${options.groupId})`);
    }

    async onApplicationShutdown(): Promise<void> {
        await Promise.allSettled(this.consumers.map((consumer) => consumer.disconnect()));
    }

    private toConsumed(topic: string, message: KafkaMessage): ConsumedMessage {
        const headers: Record<string, string> = {};
        for (const [name, value] of Object.entries(message.headers ?? {})) {
            if (value === undefined) continue;
            headers[name] = Array.isArray(value) ? value.map((v) => v.toString()).join(',') : value.toString();
        }
        return {
            topic,
            key: message.key ? message.key.toString() : null,
            value: message.value ? message.value.toString() : '',
            headers,
        };
    }
}