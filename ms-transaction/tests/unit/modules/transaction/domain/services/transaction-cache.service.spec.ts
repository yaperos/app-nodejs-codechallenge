import { Logger } from '@nestjs/common';
import { AggregateCacheService } from 'src/modules/shared/domain/services/aggregate-cache.service';
import { TransactionCacheService } from 'src/modules/transaction/domain/services/transaction-cache.service';
import { StringMother } from 'tests/unit/modules/shared/domain/mothers';
import { MockAggregateCacheService } from 'tests/unit/modules/shared/domain/services/mock-aggregate-cache.service';

import { TransactionMother } from '../mothers/transaction.Mother';

describe('TransactionCacheService test', () => {
  const mockAggregateCacheService = new MockAggregateCacheService();
  const transactionCacheService = new TransactionCacheService(
    mockAggregateCacheService,
  );
  const transaction = TransactionMother.random();
  const transactionId = transaction.getId();
  const loggerErrorSpy = jest
    .spyOn(Logger.prototype, 'error')
    .mockImplementation();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should get saved transaction', async () => {
    mockAggregateCacheService.returnOnGet(transaction.toPrimitives());

    const transactionSaved = await transactionCacheService.get(transactionId);
    expect(transactionSaved).toEqual(transaction);
    mockAggregateCacheService.assertGetHasBeenCalledWith(
      `Transaction#${transactionId}`,
    );
  });

  it('should get non-existent transaction', async () => {
    mockAggregateCacheService.returnOnGet(null);

    const transactionSaved = await transactionCacheService.get(transactionId);
    expect(transactionSaved).toBeNull();
    mockAggregateCacheService.assertGetHasBeenCalledWith(
      `Transaction#${transactionId}`,
    );
  });

  it('should set a transaction', async () => {
    await transactionCacheService.set(transaction);
    mockAggregateCacheService.assertSetHasBeenCalledWith(
      `Transaction#${transactionId}`,
      transaction,
    );
  });

  it('should delete a transaction', async () => {
    await transactionCacheService.delete(transactionId);
    mockAggregateCacheService.assertDeleteHasBeenCalledWith(
      `Transaction#${transactionId}`,
    );
  });

  it('should get non-existent transaction', async () => {
    mockAggregateCacheService.returnOnGet(null);

    const transactionSaved = await transactionCacheService.get(transactionId);
    expect(transactionSaved).toBeNull();
    mockAggregateCacheService.assertGetHasBeenCalledWith(
      `Transaction#${transactionId}`,
    );
  });

  it('should logger the error on get', async () => {
    const error = new Error(StringMother.random());
    const aggregateCacheService: Partial<AggregateCacheService<any>> = {
      get: () => {
        throw error;
      },
    };
    const transactionCacheService = new TransactionCacheService(
      aggregateCacheService as AggregateCacheService<any>,
    );

    await transactionCacheService.get(transactionId);
    expect(loggerErrorSpy).toHaveBeenCalledWith(
      ...[
        error.message,
        error.stack,
        `function get with param: ${transactionId}`,
      ],
    );
  });

  it('should logger the error on set', async () => {
    const error = new Error(StringMother.random());
    const aggregateCacheService: Partial<AggregateCacheService<any>> = {
      set: () => {
        throw error;
      },
    };
    const transactionCacheService = new TransactionCacheService(
      aggregateCacheService as AggregateCacheService<any>,
    );

    await transactionCacheService.set(transaction);
    expect(loggerErrorSpy).toHaveBeenCalledWith(
      ...[
        error.message,
        error.stack,
        `function set with param: ${JSON.stringify(transaction)}`,
      ],
    );
  });

  it('should logger the error on delete', async () => {
    const error = new Error(StringMother.random());
    const aggregateCacheService: Partial<AggregateCacheService<any>> = {
      delete: () => {
        throw error;
      },
    };
    const transactionCacheService = new TransactionCacheService(
      aggregateCacheService as AggregateCacheService<any>,
    );

    await transactionCacheService.delete(transactionId);
    expect(loggerErrorSpy).toHaveBeenCalledWith(
      ...[
        error.message,
        error.stack,
        `function delete with param: ${transactionId}`,
      ],
    );
  });
});
