import { Global, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { CACHE_PORT } from "@shared/cache";
import { CacheRedisService } from "libs/cache/cache-redis/src/cache-redis.service";
import { createRedis } from "libs/cache/cache-redis/src/redis.client";

import { REDIS } from "./redis.token";

@Global()
@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  providers: [
    {
      provide: REDIS,
      useFactory: createRedis,
    },
    {
      provide: CACHE_PORT,
      useClass: CacheRedisService,
    },
  ],
  exports: [CACHE_PORT],
})
export class CacheRedisModule {}