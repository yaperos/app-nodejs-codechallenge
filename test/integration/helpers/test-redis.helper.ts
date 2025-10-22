import * as Redis from 'ioredis';
import * as Bull from 'bull';

type Queue = Bull.Queue;

export class TestRedisHelper {
  private redisClient: Redis.Redis;
  private queues: Map<string, Queue> = new Map();

  constructor() {
    this.redisClient = new Redis.default({
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
      password: process.env.REDIS_PASSWORD,
      db: parseInt(process.env.REDIS_TEST_DB || '15'),
      lazyConnect: true,
    });
  }

  async connect(): Promise<void> {
    await this.redisClient.connect();
  }

  async disconnect(): Promise<void> {
    for (const [name, queue] of this.queues) {
      await queue.close();
    }
    this.queues.clear();

    await this.redisClient.quit();
  }

  async flushAll(): Promise<void> {
    await this.redisClient.flushdb();
  }

  async set(key: string, value: string, ttl?: number): Promise<void> {
    if (ttl) {
      await this.redisClient.setex(key, ttl, value);
    } else {
      await this.redisClient.set(key, value);
    }
  }

  async get(key: string): Promise<string | null> {
    return await this.redisClient.get(key);
  }

  async del(key: string): Promise<number> {
    return await this.redisClient.del(key);
  }

  async keys(pattern: string): Promise<string[]> {
    return await this.redisClient.keys(pattern);
  }

  async exists(key: string): Promise<number> {
    return await this.redisClient.exists(key);
  }

  createQueue(name: string): Queue {
    const queue = new Bull(name, {
      redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
        password: process.env.REDIS_PASSWORD,
        db: parseInt(process.env.REDIS_TEST_DB || '15'),
      },
      prefix: 'bull:test:',
    });

    this.queues.set(name, queue);
    return queue;
  }

  getQueue(name: string): Queue | undefined {
    return this.queues.get(name);
  }

  async cleanQueue(name: string): Promise<void> {
    const queue = this.queues.get(name);
    if (queue) {
      await queue.empty();
      await queue.clean(0, 'completed');
      await queue.clean(0, 'failed');
      await queue.clean(0, 'delayed');
      await queue.clean(0, 'active');
      await queue.clean(0, 'wait');
    }
  }

  async getQueueCounts(name: string): Promise<{
    waiting: number;
    active: number;
    completed: number;
    failed: number;
    delayed: number;
  }> {
    const queue = this.queues.get(name);
    if (!queue) {
      throw new Error(`Queue ${name} not found`);
    }

    return {
      waiting: await queue.getWaitingCount(),
      active: await queue.getActiveCount(),
      completed: await queue.getCompletedCount(),
      failed: await queue.getFailedCount(),
      delayed: await queue.getDelayedCount(),
    };
  }

  getRedisClient(): Redis.Redis {
    return this.redisClient;
  }
}
