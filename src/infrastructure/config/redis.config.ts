import { ConfigService } from "@nestjs/config";
import { BullModuleOptions } from "@nestjs/bull";

export class RedisConfig {
  static getBullRedisConfig(configService: ConfigService): BullModuleOptions {
    return RedisConfig.getStandaloneConfig(configService);
  }

  private static getStandaloneConfig(
    configService: ConfigService
  ): BullModuleOptions {
    return {
      redis: {
        host: configService.get("REDIS_HOST", "localhost"),
        port: configService.get("REDIS_PORT", 6379),
        password: configService.get("REDIS_PASSWORD"),
        db: configService.get("REDIS_DB", 0),
        retryStrategy: (times: number) => Math.min(times * 50, 2000),
        reconnectOnError: (err: Error) => {
          const targetError = "READONLY";
          if (err.message.includes(targetError)) {
            return true;
          }
          return false;
        },
        connectTimeout: 10000,
        keepAlive: 30000,
        enableOfflineQueue: true,
      },
      defaultJobOptions: {
        attempts: 3,
        backoff: {
          type: "exponential",
          delay: 2000,
        },
        removeOnComplete: 100,
        removeOnFail: 1000,
        stackTraceLimit: 10,
      },
      prefix: "bull:queue:",
    };
  }

  static getCacheRedisConfig(configService: ConfigService) {
    const baseConfig = {
      ttl: configService.get("REDIS_TTL", 300),
      max: configService.get("REDIS_MAX_ITEMS", 1000),
      keyPrefix: "cache:",
    };

    return {
      ...baseConfig,
      store: require("cache-manager-redis-store"),
      host: configService.get("REDIS_HOST", "localhost"),
      port: configService.get("REDIS_PORT", 6379),
      password: configService.get("REDIS_PASSWORD"),
      db: 1,
      lazyConnect: false,
      connectTimeout: 5000,
      enableOfflineQueue: true,
    };
  }
}
