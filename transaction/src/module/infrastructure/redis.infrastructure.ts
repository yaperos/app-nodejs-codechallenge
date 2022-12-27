import { RedisRepository } from '../domain/repositories/redis.repository'
import { RedisService } from './services/redis.service'

export class RedisInfrastructure implements RedisRepository {
  async set(key: string, value: unknown): Promise<void> {
    RedisService.set(key, value)
  }

  async get(key: string): Promise<unknown | null> {
    return RedisService.get(key)
  }
}
