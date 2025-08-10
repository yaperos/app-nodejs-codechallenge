import { Inject, Injectable } from "@nestjs/common";
import { CachePort } from "@shared/cache";
import { Redis } from "ioredis";

import { REDIS } from "./redis.token";

@Injectable()
export class CacheRedisService implements CachePort {
  constructor(@Inject(REDIS) private readonly redis: Redis) {}

  async getJson<T>(key: string): Promise<T | null> {
    const raw = await this.redis.get(key);
    return raw ? JSON.parse(raw) : null;
  }

  async setJson<T>(key: string, value: T, ttlSeconds: number): Promise<void> {
    await this.redis.set(key, JSON.stringify(value), 'EX', ttlSeconds);
  }

  async del(key: string): Promise<void> {
    await this.redis.del(key);
  }
}