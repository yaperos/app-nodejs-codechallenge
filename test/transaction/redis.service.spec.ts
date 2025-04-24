import { RedisService } from '../../src/modules/transaction/infrastructure/redis/redis.service';
import Redis from 'ioredis';

jest.mock('ioredis');

describe('RedisService', () => {
  let redisService: RedisService;
  let redisMock: jest.Mocked<Redis>;

  beforeEach(async () => {
    redisMock = {
      set: jest.fn(),
      get: jest.fn(),
      quit: jest.fn(),
    } as any;

    (Redis as unknown as jest.Mock).mockImplementation(() => redisMock);

    redisService = new RedisService();
    await redisService.onModuleInit();
  });

  it('should set a value in Redis', async () => {
    await redisService.set('key', { foo: 'bar' });
    expect(redisMock.set).toHaveBeenCalledWith('key', JSON.stringify({ foo: 'bar' }), 'EX', 3600);
  });

  it('should get a value from Redis', async () => {
    redisMock.get.mockResolvedValue(JSON.stringify({ foo: 'bar' }));
    const result = await redisService.get<{ foo: string }>('key');
    expect(result).toEqual({ foo: 'bar' });
  });

  it('should quit Redis on module destroy', async () => {
    await redisService.onModuleDestroy();
    expect(redisMock.quit).toHaveBeenCalled();
  });
});