import { Inject, Injectable, Logger } from '@nestjs/common';
import { BrokenCircuitError, circuitBreaker, ConsecutiveBreaker, handleAll } from 'cockatiel';
import type { Redis } from 'ioredis';
import { ProcessedMessageStorePort } from '../../domain/ports/processed-message.store.port';
import { REDIS_CLIENT } from '../tokens';

const TTL_SECONDS = 7 * 24 * 60 * 60;


@Injectable()
export class RedisProcessedMessageStore extends ProcessedMessageStorePort {
    private readonly logger = new Logger(RedisProcessedMessageStore.name);
    private readonly breaker = circuitBreaker(handleAll, {
        halfOpenAfter: 10_000,
        breaker: new ConsecutiveBreaker(5),
    });

    constructor(@Inject(REDIS_CLIENT) private readonly redis: Redis) {
        super();
        this.breaker.onBreak(() => this.logger.error('Redis circuit OPEN: idempotency check disabled'));
        this.breaker.onReset(() => this.logger.log('Redis circuit CLOSED'));
    }

    private key(eventId: string): string {
        return `anti-fraud:processed:${eventId}`;
    }

    private async safe<T>(operation: string, fn: () => Promise<T>, fallback: T): Promise<T> {
        try {
            return await this.breaker.execute(fn);
        } catch (error) {
            if (!(error instanceof BrokenCircuitError)) {
                this.logger.warn(`Redis ${operation} failed: ${(error as Error).message}`);
            }
            return fallback;
        }
    }

    wasProcessed(eventId: string): Promise<boolean> {
        return this.safe<boolean>(
            'exists',
            async () => (await this.redis.exists(this.key(eventId))) === 1,
            false,
        );
    }

    async markProcessed(eventId: string): Promise<void> {
        await this.safe<void>(
            'set',
            async () => {
                await this.redis.set(this.key(eventId), '1', 'EX', TTL_SECONDS);
            },
            undefined,
        );
    }
}