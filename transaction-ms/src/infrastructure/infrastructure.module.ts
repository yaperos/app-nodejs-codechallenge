import type { Env } from '../config/env';
import { Global, Inject, Module, type OnApplicationShutdown } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Kafka, logLevel } from 'kafkajs';
import { Redis } from 'ioredis';
import { IdempotencyStorePort } from '../application/ports/idempotency-store.port';
import { MessageConsumerPort } from '../application/ports/message-consumer.port';
import { TransactionCachePort } from '../application/ports/transaction-cache.port';
import { TransactionRepositoryPort } from '../domain/ports/transaction.repository.port';
import { UnitOfWorkPort } from '../domain/ports/unit-of-work.port';
import { RedisIdempotencyStore } from './cache/redis-idempotency.store';
import { RedisTransactionCache } from './cache/redis-transaction.cache';
import { DeadLetterPublisher } from './messaging/dead-letter.publisher';
import { KafkaMessageConsumer } from './messaging/kafka-message.consumer';
import { KafkaProducer } from './messaging/kafka.producer';
import { OutboxRelayService } from './outbox/outbox-relay.service';
import { PrismaTransactionRepository } from './persistence/prisma/prisma-transaction.repository';
import { PrismaUnitOfWork } from './persistence/prisma/prisma-unit-of-work';
import { PrismaService } from './persistence/prisma/prisma.service';
import { KAFKA_CLIENT, REDIS_CLIENT } from './tokens';
import { KafkaTopicInitializer } from './messaging/kafka-topic.initializer';

@Global()
@Module({
    providers: [
        PrismaService,
        KafkaTopicInitializer,
        KafkaProducer,
        DeadLetterPublisher,
        OutboxRelayService,
        {
            provide: KAFKA_CLIENT,
            inject: [ConfigService],
            useFactory: (config: ConfigService<Env, true>) =>
                new Kafka({
                    clientId: 'transaction-service',
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
        { provide: TransactionRepositoryPort, useClass: PrismaTransactionRepository },
        { provide: UnitOfWorkPort, useClass: PrismaUnitOfWork },
        { provide: TransactionCachePort, useClass: RedisTransactionCache },
        { provide: IdempotencyStorePort, useClass: RedisIdempotencyStore },
        { provide: MessageConsumerPort, useClass: KafkaMessageConsumer },
    ],
    exports: [
        PrismaService,
        TransactionRepositoryPort,
        UnitOfWorkPort,
        TransactionCachePort,
        IdempotencyStorePort,
        MessageConsumerPort,
    ],
})
export class InfrastructureModule implements OnApplicationShutdown {
    constructor(@Inject(REDIS_CLIENT) private readonly redis: Redis) { }

    async onApplicationShutdown(): Promise<void> {
        await this.redis.quit().catch(() => undefined);
    }
}