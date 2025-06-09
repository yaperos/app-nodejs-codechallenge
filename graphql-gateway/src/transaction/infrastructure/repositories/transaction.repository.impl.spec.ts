import TransactionRepositoryImpl from './transaction.repository.impl';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { Test, TestingModule } from '@nestjs/testing';
import { createMockTransactionEntity } from '../../../../test/factories/transactionEntity.factory';

describe('TransactionRepositoryImpl', () => {
  let repository: TransactionRepositoryImpl;
  let cacheManager: jest.Mocked<Cache>;

  beforeEach(async () => {
    const mockCacheManager = {
      set: jest.fn(),
      get: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionRepositoryImpl,
        {
          provide: CACHE_MANAGER,
          useValue: mockCacheManager,
        },
      ],
    }).compile();

    repository = module.get(TransactionRepositoryImpl);
    cacheManager = module.get(CACHE_MANAGER);

    jest.clearAllMocks();
  });

  it('should save a transaction in cache', async () => {
    const transaction = createMockTransactionEntity();

    cacheManager.set.mockResolvedValue(undefined); // set usually returns void or true

    await expect(repository.create(transaction)).resolves.toBeUndefined();
    expect(cacheManager.set).toHaveBeenCalledWith(transaction.id, transaction);
  });

  it('should retrieve a transaction from cache by id', async () => {
    const transaction = createMockTransactionEntity();
    cacheManager.get.mockResolvedValue(transaction);

    const result = await repository.findByid(transaction.id);

    expect(result).toEqual(transaction);
    expect(cacheManager.get).toHaveBeenCalledWith(transaction.id);
  });
});
