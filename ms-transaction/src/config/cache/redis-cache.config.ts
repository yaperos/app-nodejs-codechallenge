import { Logger } from '@nestjs/common';
import { registerAs } from '@nestjs/config';
import { IsInt, IsNotEmpty, validateSync } from 'class-validator';

export class RedisCacheConfig {
  private readonly logger = new Logger(this.constructor.name);

  @IsNotEmpty()
  readonly host = <string>process.env.REDIS_HOST;

  @IsInt()
  readonly port = Number(process.env.REDIS_PORT);

  @IsInt()
  readonly ttlInSeconds = Number(process.env.REDIS_TTL_SECONDS);

  constructor() {
    const error = validateSync(this);
    if (!error.length) return;
    this.logger.error(
      `${this.constructor.name} validation error: ${JSON.stringify(error)}`,
    );
    process.exit(1);
  }
}

export const REDIS_CACHE_CONFIG_KEY = 'redis_cache';

export const redisCacheConfigFactory = registerAs(
  REDIS_CACHE_CONFIG_KEY,
  (): RedisCacheConfig => {
    return new RedisCacheConfig();
  },
);
