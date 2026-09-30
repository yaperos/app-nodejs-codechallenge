import type { Env } from '../config/env';
import { Inject, Module, type OnApplicationShutdown } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Redis } from 'ioredis';
import { Kafka, logLevel } from 'kafkajs';
import { MessageConsumerPort } from '../application/ports/message-consumer.port';
import { EvaluationPublisherPort } from '../domain/ports/evaluation-publisher.port';
import { ProcessedMessageStorePort } from '../domain/ports/processed-message.store.port';
import { RedisProcessedMessageStore } from './idempotency/redis-processed-message.store';
import { DeadLetterPublisher } from './messaging/dead-letter.publisher';
import { KafkaEvaluationPublisher } from './messaging/kafka-evaluation.publisher';
import { KafkaMessageConsumer } from './messaging/kafka-message.consumer';
import { KafkaProducer } from './messaging/kafka.producer';
import { KAFKA_CLIENT, REDIS_CLIENT } from './tokens';

@Module({
    providers: [
        KafkaProducer,
        DeadLetterPublisher,
        {
            provide: KAFKA_CLIENT,
            inject: [ConfigService],
            useFactory: (config: ConfigService<Env, true>) =>
                new Kafka({
                    clientId: 'anti-fraud-service',
                    brokers: config.get('KAFKA_BROKERS', { infer: true }).split(','),
                    logLevel: logLevel.WARN,
                    retry: { retries: 8 },
                }),
        },
        {
            provide: REDIS_CLIENT,
            inject: [ConfigService],
            useFactory: (config: ConfigService<Env, true>) => {
                const redis = new Redis(config.get('REDIS_URL', { infer: true }), {
                    maxRetriesPerRequest: 1,
                    commandTimeout: 500,
                    enableOfflineQueue: false,
                });
                redis.on('error', () => undefined);
                return redis;
            },
        },
        { provide: EvaluationPublisherPort, useClass: KafkaEvaluationPublisher },
        { provide: ProcessedMessageStorePort, useClass: RedisProcessedMessageStore },
        { provide: MessageConsumerPort, useClass: KafkaMessageConsumer },
    ],
    exports: [EvaluationPublisherPort, ProcessedMessageStorePort, MessageConsumerPort],
})
export class InfrastructureModule implements OnApplicationShutdown {
    constructor(@Inject(REDIS_CLIENT) private readonly redis: Redis) { }

    async onApplicationShutdown(): Promise<void> {
        await this.redis.quit().catch(() => undefined);
    }
}