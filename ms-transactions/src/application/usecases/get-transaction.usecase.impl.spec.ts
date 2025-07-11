import { GetTransactionUseCaseImpl } from './get-transaction.usecase.impl';
import { TransactionRepository } from '../../domain/repositories/transaction.repository';
import { Transaction } from '../../domain/entities/transaction';
import {
  TransactionStatus,
  TransactionType,
} from '../../domain/enums/transaction.enums';
import { NotFoundException } from '@nestjs/common';
import { Cache } from 'cache-manager';
import Decimal from 'decimal.js';

describe('GetTransactionUseCaseImpl', () => {
  let useCase: GetTransactionUseCaseImpl;
  let transactionRepository: jest.Mocked<TransactionRepository>;
  let cacheManager: jest.Mocked<Pick<Cache, 'get' | 'set' | 'del'>>;
  let findByIdSpy: jest.SpyInstance;

  beforeEach(() => {
    transactionRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      updateStatus: jest.fn(),
    } as jest.Mocked<TransactionRepository>;

    cacheManager = {
      get: jest.fn(),
      set: jest.fn(),
      del: jest.fn(),
    } as jest.Mocked<Pick<Cache, 'get' | 'set' | 'del'>>;

    findByIdSpy = jest.spyOn(transactionRepository, 'findById');
    useCase = new GetTransactionUseCaseImpl(
      transactionRepository,
      cacheManager as unknown as Cache,
    );
  });

  it('should return transaction from cache if found', async () => {
    expect.hasAssertions();
    const cachedTransaction = {
      id: 'tx1',
      accountDebit: '550e8400-e29b-41d4-a716-446655440000',
      accountCredit: '550e8400-e29b-41d4-a716-446655440001',
      transferType: TransactionType.TRANSFER,
      status: TransactionStatus.PENDING,
      value: '100',
      createdAt: '2023-01-01T00:00:00.000Z',
    };
    cacheManager.get.mockResolvedValue(cachedTransaction);

    const result = await useCase.execute('tx1');

    expect(result).toBeInstanceOf(Transaction);
    expect(result.id).toBe('tx1');
    expect(result.value).toBeInstanceOf(Decimal);
    expect(cacheManager.get).toHaveBeenCalledWith('transaction:tx1');
    expect(findByIdSpy).not.toHaveBeenCalled(); // Should not hit database
  });

  it('should return transaction from database if not in cache and cache it', async () => {
    expect.hasAssertions();
    const transaction: Transaction = {
      id: 'tx1',
      accountDebit: '550e8400-e29b-41d4-a716-446655440000',
      accountCredit: '550e8400-e29b-41d4-a716-446655440001',
      transferType: TransactionType.TRANSFER,
      status: TransactionStatus.PENDING,
      value: new Decimal(100),
      createdAt: new Date(),
    };
    cacheManager.get.mockResolvedValue(null); // Not in cache
    findByIdSpy.mockResolvedValue(transaction);

    const result = await useCase.execute('tx1');

    expect(result).toBe(transaction);
    expect(findByIdSpy).toHaveBeenCalledTimes(1);
    expect(findByIdSpy).toHaveBeenLastCalledWith('tx1');
    expect(cacheManager.set).toHaveBeenCalledWith(
      'transaction:tx1',
      expect.objectContaining({
        id: 'tx1',
        value: '100',
      }),
      3600,
    );
  });

  it('should throw NotFoundException if not found in cache or database', async () => {
    expect.hasAssertions();
    cacheManager.get.mockResolvedValue(null);
    findByIdSpy.mockResolvedValue(null);

    await expect(useCase.execute('notfound')).rejects.toBeInstanceOf(
      NotFoundException,
    );
    expect(findByIdSpy).toHaveBeenCalledWith('notfound');
  });
});
