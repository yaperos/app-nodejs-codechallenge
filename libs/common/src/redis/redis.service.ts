import { Injectable, type OnModuleDestroy, type OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
    private redisClient: Redis;

    constructor(private readonly configService: ConfigService) {}

    onModuleInit() {
        const redisUrl = this.configService.get<string>('REDIS_URL');
        if (!redisUrl) {
            throw new Error('REDIS_URL environment variable is required');
        }

        this.redisClient = new Redis(redisUrl);
    }

    onModuleDestroy() {
        this.redisClient.disconnect();
    }

    async get<T>(key: string): Promise<T | null> {
        const data = await this.redisClient.get(key);
        return data ? JSON.parse(data) : null;
    }

    async set<T>(key: string, value: T, ttlSeconds: number = 600): Promise<void> {
        await this.redisClient.set(key, JSON.stringify(value), 'EX', ttlSeconds);
    }

    async del(key: string): Promise<void> {
        await this.redisClient.del(key);
    }
}
