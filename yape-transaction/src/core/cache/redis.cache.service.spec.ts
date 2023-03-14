import { getRedisToken } from '@liaoliaots/nestjs-redis';
import { Test, TestingModule } from '@nestjs/testing';
import { environment } from '@core/config/environment';
import { RedisCacheService } from './redis.cache.service';
import { RedisCacheMock } from './redis.mock.spec';
import { TransactionMock } from '../../modules/transaction/transaction.mock.spec';

describe('RedisCacheService', () => {
  let redisCacheService: RedisCacheService;
  let redisServiceMock: RedisCacheMock = new RedisCacheMock();
  const transactionString = JSON.stringify(TransactionMock.transaction);
  const id = 'redis-cache-id';
  const key = 'test';
  const value = 'test value';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: getRedisToken(environment.cacheConfig.name),
          useValue: redisServiceMock,
        },
        RedisCacheService,
      ],
    }).compile();

    redisCacheService = module.get<RedisCacheService>(RedisCacheService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(redisCacheService).toBeDefined();
  });

  it('set should be called set method of redis service', async () => {
    const spySet = jest
      .spyOn(redisServiceMock, 'set')
      .mockResolvedValueOnce('OK');

    await redisCacheService.set(key, value);

    expect(spySet).toBeCalledWith(
      key,
      value,
      'EX',
      environment.cacheConfig.ttl,
    );
  });

  it('get should be called get method of redis service', async () => {
    const spyGet = jest.spyOn(redisServiceMock, 'get').mockResolvedValue(value);
    const getOfRedis = await redisCacheService.get(key);
    expect(getOfRedis).toBeDefined();
    expect(spyGet).toBeCalled();
    expect(getOfRedis).toEqual(value);
  });

  it('getTransaction should be return a transaction object', async () => {
    const spyGet = jest
      .spyOn(redisServiceMock, 'get')
      .mockResolvedValueOnce(transactionString);
    const response = await redisCacheService.getTransaction(id);

    expect(spyGet).toHaveBeenCalledWith(id);

    expect(response).toBeDefined();
    expect(response).toEqual(JSON.parse(transactionString));
  });
});
