import { Redis } from "ioredis";
import { envConfig } from "libs/config/env.config";

export function createRedis() {
  return new Redis({
    host: envConfig.redis.host,
    port: envConfig.redis.port,
    db: envConfig.redis.db,
    password: envConfig.redis.password,
    lazyConnect: false,
  });
}