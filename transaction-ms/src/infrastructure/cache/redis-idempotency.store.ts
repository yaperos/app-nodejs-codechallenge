import { Inject, Injectable } from "@nestjs/common";
import type { Redis } from 'ioredis';
import { type IdempotencyRecord, IdempotencyStorePort } from "../../application/ports/idempotency-store.port";
import { REDIS_CLIENT } from "../tokens";


@Injectable()
export class RedisIdempotencyStore extends IdempotencyStorePort {
    constructor(
        @Inject(REDIS_CLIENT)
        private readonly redis: Redis
    ) {
        super();
    }

    private setKey(key: string): string {
        return `idempotency:transactions:${key}`;
    }

    async acquire(key: string, fingerprint: string, ttlSeconds: number): Promise<IdempotencyRecord | null> {
        const record: IdempotencyRecord = { status: 'in_progress', fingerprint };

        const reserved = await this.redis.set(this.setKey(key), JSON.stringify(record), 'EX', ttlSeconds, 'NX');

        if (reserved === 'OK') return null;

        const raw = await this.redis.get(this.setKey(key));

        return raw ? (JSON.parse(raw) as IdempotencyRecord) : null

    }
    async complete(key: string, fingerprint: string, response: unknown, ttlSeconds: number): Promise<void> {
        const record: IdempotencyRecord = { status: 'completed', fingerprint, response };

        await this.redis.set(this.setKey(key), JSON.stringify(record), 'EX', ttlSeconds);
    }
    async release(key: string): Promise<void> {
        await this.redis.del(this.setKey(key));
    }

}