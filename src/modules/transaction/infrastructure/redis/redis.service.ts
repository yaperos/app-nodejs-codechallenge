import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';

/**
 * RedisService is a wrapper around the ioredis client.
 * It handles Redis connection lifecycle and provides simple 
 * get/set methods with JSON serialization and TTL support.
 */
@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private client!: Redis;
  private readonly ttlSeconds = parseInt(process.env.REDIS_TTL_SECONDS || '3600', 10);

  /**
   * Initializes the Redis connection when the module is started.
   * Configuration is read from environment variables.
   */
  async onModuleInit() {
    this.client = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379', 10),
    });
  }

  /**
   * Stores a value in Redis using a JSON string.
   * An expiration time (TTL) can be provided, or defaults to the class-level TTL.
   * 
   * @param key - The Redis key.
   * @param value - The value to be stored.
   * @param ttlSeconds - Optional custom TTL in seconds.
   */
  async set(key: string, value: any, ttlSeconds = this.ttlSeconds) {
    await this.client.set(key, JSON.stringify(value), 'EX', ttlSeconds);
  }

  /**
   * Retrieves a value from Redis and parses it from JSON.
   * 
   * @param key - The Redis key.
   * @returns The parsed object or null if not found.
   */
  async get<T>(key: string): Promise<T | null> {
    const result = await this.client.get(key);
    return result ? JSON.parse(result) : null;
  }

  /**
   * Closes the Redis connection when the module is destroyed.
   */
  async onModuleDestroy() {
    await this.client.quit();
  }
}
