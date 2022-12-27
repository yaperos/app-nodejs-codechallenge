import * as redis from 'redis'
import { logger } from '../../../core/utils/logger'
import { EnvConfig } from '../../../core/utils/env-config'

export class RedisService {
  static redisClient: redis.RedisClientType
  static async start(): Promise<void> {
    RedisService.redisClient = redis.createClient({
      socket: {
        host: EnvConfig.redisHost,
        port: EnvConfig.redisPort,
      },
      password: EnvConfig.redisPassword,
    })
  }
  static async set(key: string, value: unknown): Promise<void> {
    try {
      RedisService.start()
      await RedisService.redisClient.connect()
      await RedisService.redisClient.set(key, JSON.stringify(value))
      await RedisService.redisClient.disconnect()
    } catch (error) {
      logger.error(error)
    }
  }

  static async get(key: string): Promise<unknown | null> {
    try {
      RedisService.start()
      await RedisService.redisClient.connect()
      const value = await RedisService.redisClient.get(key)
      await RedisService.redisClient.disconnect()

      return value ? JSON.parse(value) : null
    } catch (error) {
      logger.error(error)
      return null
    }
  }

  static async delete(key: string): Promise<void> {
    try {
      RedisService.start()
      await RedisService.redisClient.connect()
      await RedisService.redisClient.del(key)
      await RedisService.redisClient.disconnect()
    } catch (error) {
      logger.error(error)
    }
  }
}
