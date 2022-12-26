import * as redis from 'redis'
import { EnvConfig } from '../../core/utils/env-config'
import { RedisRepository } from '../domain/repositories/redis.repository'
import { logger } from '../../core/utils/logger'

export class RedisInfrastructure implements RedisRepository {
  private redisClient: redis.RedisClientType
  constructor() {
    this.redisClient = redis.createClient({
      socket: {
        host: EnvConfig.redisHost,
        port: EnvConfig.redisPort,
      },
      password: EnvConfig.redisPassword,
    })
  }
  async set(key: string, value: unknown): Promise<void> {
    try {
      await this.redisClient.connect()
      await this.redisClient.set(key, JSON.stringify(value))
      await this.redisClient.disconnect()
    } catch (error) {
      logger.error(error)
    }
  }

  async get(key: string): Promise<unknown | null> {
    try {
      await this.redisClient.connect()
      const value = await this.redisClient.get(key)
      await this.redisClient.disconnect()

      return value ? JSON.parse(value) : null
    } catch (error) {
      logger.error(error)
      return null
    }
  }
}
