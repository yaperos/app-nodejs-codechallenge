import { ConfigService } from '@nestjs/config';
import { RedisConfig } from './redis.config';

jest.mock('cache-manager-redis-store', () => ({}));

describe('RedisConfig', () => {
  let configService: jest.Mocked<ConfigService>;

  beforeEach(() => {
    configService = {
      get: jest.fn((key: string, defaultValue?: any) => {
        const config: Record<string, any> = {
          'REDIS_HOST': 'localhost',
          'REDIS_PORT': 6379,
          'REDIS_PASSWORD': undefined,
          'REDIS_DB': 0,
          'REDIS_MODE': 'standalone',
          'REDIS_TTL': 300,
          'REDIS_MAX_ITEMS': 1000,
        };
        return config[key] ?? defaultValue;
      }),
    } as unknown as jest.Mocked<ConfigService>;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getBullRedisConfig', () => {
    it('should return standalone configuration by default', () => {
      const config = RedisConfig.getBullRedisConfig(configService);

      expect(config).toBeDefined();
      expect(config.redis).toBeDefined();
      expect(config.redis).toHaveProperty('host', 'localhost');
      expect(config.redis).toHaveProperty('port', 6379);
      expect(config.prefix).toBe('bull:queue:');
    });

    it('should use configured Redis host and port', () => {
      (configService.get as jest.Mock).mockImplementation((key: string, defaultValue?: any) => {
        const config: Record<string, any> = {
          'REDIS_HOST': 'redis.example.com',
          'REDIS_PORT': 6380,
          'REDIS_MODE': 'standalone',
        };
        return config[key] ?? defaultValue;
      });

      const config = RedisConfig.getBullRedisConfig(configService);

      expect(config.redis).toHaveProperty('host', 'redis.example.com');
      expect(config.redis).toHaveProperty('port', 6380);
    });

    it('should include password when configured', () => {
      (configService.get as jest.Mock).mockImplementation((key: string, defaultValue?: any) => {
        const config: Record<string, any> = {
          'REDIS_HOST': 'localhost',
          'REDIS_PORT': 6379,
          'REDIS_PASSWORD': 'secret123',
          'REDIS_DB': 0,
          'REDIS_MODE': 'standalone',
        };
        return config[key] ?? defaultValue;
      });

      const config = RedisConfig.getBullRedisConfig(configService);

      expect(config.redis).toHaveProperty('password', 'secret123');
    });

    it('should use configured database number', () => {
      (configService.get as jest.Mock).mockImplementation((key: string, defaultValue?: any) => {
        const config: Record<string, any> = {
          'REDIS_HOST': 'localhost',
          'REDIS_PORT': 6379,
          'REDIS_DB': 5,
          'REDIS_MODE': 'standalone',
        };
        return config[key] ?? defaultValue;
      });

      const config = RedisConfig.getBullRedisConfig(configService);

      expect(config.redis).toHaveProperty('db', 5);
    });

    it('should include connection settings', () => {
      const config = RedisConfig.getBullRedisConfig(configService);

      expect(config.redis).toHaveProperty('connectTimeout', 10000);
      expect(config.redis).toHaveProperty('keepAlive', 30000);
      expect(config.redis).toHaveProperty('enableOfflineQueue', true);
      expect(config.redis).toHaveProperty('retryStrategy');
      expect(config.redis).toHaveProperty('reconnectOnError');
    });

    it('should include Bull default job options', () => {
      const config = RedisConfig.getBullRedisConfig(configService);

      expect(config.defaultJobOptions).toEqual({
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 2000,
        },
        removeOnComplete: 100,
        removeOnFail: 1000,
        stackTraceLimit: 10,
      });
    });
  });

  describe('retryStrategy', () => {
    it('should implement exponential backoff with cap at 2000ms', () => {
      const config = RedisConfig.getBullRedisConfig(configService);
      const redisConfig = config.redis as any;
      const retryStrategy = redisConfig.retryStrategy as (times: number) => number;

      expect(retryStrategy(1)).toBe(50); 
      expect(retryStrategy(5)).toBe(250); 
      expect(retryStrategy(20)).toBe(1000); 
      expect(retryStrategy(40)).toBe(2000); 
      expect(retryStrategy(100)).toBe(2000); 
    });

    it('should return reasonable delays for first few retries', () => {
      const config = RedisConfig.getBullRedisConfig(configService);
      const redisConfig = config.redis as any;
      const retryStrategy = redisConfig.retryStrategy as (times: number) => number;

      const firstRetry = retryStrategy(1);
      const secondRetry = retryStrategy(2);
      const thirdRetry = retryStrategy(3);

      expect(firstRetry).toBeLessThan(secondRetry);
      expect(secondRetry).toBeLessThan(thirdRetry);
      expect(firstRetry).toBe(50);
      expect(secondRetry).toBe(100);
      expect(thirdRetry).toBe(150);
    });
  });

  describe('reconnectOnError', () => {
    it('should reconnect on READONLY errors', () => {
      const config = RedisConfig.getBullRedisConfig(configService);
      const redisConfig = config.redis as any;
      const reconnectOnError = redisConfig.reconnectOnError as (err: Error) => boolean;

      const readonlyError = new Error('READONLY: You can\'t write against a read only replica.');

      expect(reconnectOnError(readonlyError)).toBe(true);
    });

    it('should not reconnect on other errors', () => {
      const config = RedisConfig.getBullRedisConfig(configService);
      const redisConfig = config.redis as any;
      const reconnectOnError = redisConfig.reconnectOnError as (err: Error) => boolean;

      const otherError = new Error('Connection timeout');
      const anotherError = new Error('Network error');

      expect(reconnectOnError(otherError)).toBe(false);
      expect(reconnectOnError(anotherError)).toBe(false);
    });

    it('should handle errors without message', () => {
      const config = RedisConfig.getBullRedisConfig(configService);
      const redisConfig = config.redis as any;
      const reconnectOnError = redisConfig.reconnectOnError as (err: Error) => boolean;

      const emptyError = new Error('');

      expect(reconnectOnError(emptyError)).toBe(false);
    });

    it('should be case-sensitive for READONLY check', () => {
      const config = RedisConfig.getBullRedisConfig(configService);
      const redisConfig = config.redis as any;
      const reconnectOnError = redisConfig.reconnectOnError as (err: Error) => boolean;

      const lowercaseError = new Error('readonly: some message');
      const mixedcaseError = new Error('ReadOnly: some message');

      expect(reconnectOnError(lowercaseError)).toBe(false);
      expect(reconnectOnError(mixedcaseError)).toBe(false);
    });
  });

  describe('getCacheRedisConfig', () => {
    it('should return cache configuration with defaults', () => {
      const config = RedisConfig.getCacheRedisConfig(configService);

      expect(config).toBeDefined();
      expect(config.ttl).toBe(300);
      expect(config.max).toBe(1000);
      expect(config.keyPrefix).toBe('cache:');
      expect(config.host).toBe('localhost');
      expect(config.port).toBe(6379);
      expect(config.db).toBe(1); 
    });

    it('should use custom TTL when configured', () => {
      (configService.get as jest.Mock).mockImplementation((key: string, defaultValue?: any) => {
        if (key === 'REDIS_TTL') return 600;
        if (key === 'REDIS_HOST') return 'localhost';
        if (key === 'REDIS_PORT') return 6379;
        return defaultValue;
      });

      const config = RedisConfig.getCacheRedisConfig(configService);

      expect(config.ttl).toBe(600);
    });

    it('should use custom max items when configured', () => {
      (configService.get as jest.Mock).mockImplementation((key: string, defaultValue?: any) => {
        if (key === 'REDIS_MAX_ITEMS') return 5000;
        if (key === 'REDIS_HOST') return 'localhost';
        if (key === 'REDIS_PORT') return 6379;
        return defaultValue;
      });

      const config = RedisConfig.getCacheRedisConfig(configService);

      expect(config.max).toBe(5000);
    });

    it('should include password when configured', () => {
      (configService.get as jest.Mock).mockImplementation((key: string, defaultValue?: any) => {
        if (key === 'REDIS_PASSWORD') return 'cachepassword';
        if (key === 'REDIS_HOST') return 'localhost';
        if (key === 'REDIS_PORT') return 6379;
        if (key === 'REDIS_TTL') return 300;
        if (key === 'REDIS_MAX_ITEMS') return 1000;
        return defaultValue;
      });

      const config = RedisConfig.getCacheRedisConfig(configService);

      expect(config.password).toBe('cachepassword');
    });

    it('should include cache-specific connection settings', () => {
      const config = RedisConfig.getCacheRedisConfig(configService);

      expect(config.lazyConnect).toBe(false);
      expect(config.connectTimeout).toBe(5000);
      expect(config.enableOfflineQueue).toBe(true);
    });

    it('should use different database than Bull config', () => {
      const bullConfig = RedisConfig.getBullRedisConfig(configService);
      const cacheConfig = RedisConfig.getCacheRedisConfig(configService);

      expect((bullConfig.redis as any).db).toBe(0);
      expect(cacheConfig.db).toBe(1);
    });

    it('should include cache-manager-redis-store', () => {
      const config = RedisConfig.getCacheRedisConfig(configService);

      expect(config.store).toBeDefined();
    });
  });

  describe('Configuration Consistency', () => {
    it('should use same host and port for both Bull and cache configs', () => {
      (configService.get as jest.Mock).mockImplementation((key: string, defaultValue?: any) => {
        if (key === 'REDIS_HOST') return 'prod-redis.example.com';
        if (key === 'REDIS_PORT') return 6380;
        if (key === 'REDIS_DB') return 0;
        if (key === 'REDIS_MODE') return 'standalone';
        if (key === 'REDIS_TTL') return 300;
        if (key === 'REDIS_MAX_ITEMS') return 1000;
        return defaultValue;
      });

      const bullConfig = RedisConfig.getBullRedisConfig(configService);
      const cacheConfig = RedisConfig.getCacheRedisConfig(configService);

      expect((bullConfig.redis as any).host).toBe('prod-redis.example.com');
      expect(cacheConfig.host).toBe('prod-redis.example.com');
      expect((bullConfig.redis as any).port).toBe(6380);
      expect(cacheConfig.port).toBe(6380);
    });

    it('should use same password for both Bull and cache configs when set', () => {
      (configService.get as jest.Mock).mockImplementation((key: string, defaultValue?: any) => {
        if (key === 'REDIS_PASSWORD') return 'shared-password';
        if (key === 'REDIS_HOST') return 'localhost';
        if (key === 'REDIS_PORT') return 6379;
        if (key === 'REDIS_DB') return 0;
        if (key === 'REDIS_MODE') return 'standalone';
        if (key === 'REDIS_TTL') return 300;
        if (key === 'REDIS_MAX_ITEMS') return 1000;
        return defaultValue;
      });

      const bullConfig = RedisConfig.getBullRedisConfig(configService);
      const cacheConfig = RedisConfig.getCacheRedisConfig(configService);

      expect((bullConfig.redis as any).password).toBe('shared-password');
      expect(cacheConfig.password).toBe('shared-password');
    });
  });
});
