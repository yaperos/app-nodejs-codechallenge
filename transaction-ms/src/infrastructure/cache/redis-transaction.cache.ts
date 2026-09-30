import { Inject, Injectable, Logger } from "@nestjs/common";
import { BrokenCircuitError } from 'cockatiel';

import { TransactionCachePort } from "../../application/ports/transaction-cache.port";
import { REDIS_CLIENT } from "../tokens";
import Redis from "ioredis";
import { TransactionView } from "../../application/dtos/transaction.view";
import { createCircuitBreaker, failOpen } from "../resilence";

@Injectable()
export class RedisTransactionCache extends TransactionCachePort {

    private readonly logger = new Logger(RedisTransactionCache.name);
    private readonly breaker = createCircuitBreaker({
        name: 'redis-cache',
        failureThreshold: 5,
        halfOpenAfterMs: 10_000,
    });

    constructor(
        @Inject(REDIS_CLIENT) private readonly redis: Redis
    ) {
        super();
        this.breaker.onBreak(() => this.logger.error('Redis circuit OPEN: reading from DB only'));
        this.breaker.onReset(() => this.logger.log('Redis circuit CLOSED'));
    }

    private key(id: string): string {
        return `transaction:${id}`;
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

    get(id: string): Promise<TransactionView | null> {
        return failOpen<TransactionView | null>({
            policy: this.breaker,
            logger: this.logger,
            operation: 'cache get',
            fn: async () => {
                const raw = await this.redis.get(this.key(id));
                return raw ? (JSON.parse(raw) as TransactionView) : null;
            },
            fallback: null,
        });
    }

    set(view: TransactionView, ttlSeconds: number): Promise<void> {
        return failOpen<void>({
            policy: this.breaker,
            logger: this.logger,
            operation: 'cache set',
            fn: async () => {
                await this.redis.set(
                    this.key(view.transactionExternalId),
                    JSON.stringify(view),
                    'EX',
                    ttlSeconds,
                );
            },
            fallback: undefined,
        });
    }

    invalidate(id: string): Promise<void> {
        return failOpen<void>({
            policy: this.breaker,
            logger: this.logger,
            operation: 'cache invalidate',
            fn: async () => {
                await this.redis.del(this.key(id));
            },
            fallback: undefined,
        });
    }
}