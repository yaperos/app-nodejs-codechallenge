import { CallHandler, ExecutionContext, HttpStatus } from '@nestjs/common';
import { RpcArgumentsHost } from '@nestjs/common/interfaces';
import { firstValueFrom } from 'rxjs';
import { TransactionOutput } from 'src/modules/transaction/application/dtos/transaction.output';
import { TransactionCacheInterceptor } from 'src/modules/transaction/infrastructure/interceptors/transaction-cache.interceptor';

import { TransactionMother } from '../domain/mothers/transaction.mother';
import { MockTransactionCacheService } from '../domain/services/mock-transaction-cache.service';

describe('TransactionCacheInterceptor test', () => {
  const transaction = TransactionMother.random();
  const transactionId = transaction.getId();
  const mockTransactionCacheService = new MockTransactionCacheService();
  const transactionCacheInterceptor = new TransactionCacheInterceptor(
    mockTransactionCacheService,
  );
  const next: CallHandler = {
    handle: jest.fn().mockResolvedValue({}),
  };

  let context: Partial<ExecutionContext>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return a cached transaction', async () => {
    mockTransactionCacheService.returnOnGet(transaction);

    context = {
      switchToRpc: () =>
        ({
          getContext: () => ({}),
          getData: jest.fn().mockReturnValue({ id: transactionId }),
        } as RpcArgumentsHost),
    };
    const response = await transactionCacheInterceptor.intercept(
      context as ExecutionContext,
      next,
    );
    const output = await firstValueFrom(response);

    expect(output.code).toEqual(HttpStatus.OK);
    expect(output.data).toEqual(TransactionOutput.fromTransaction(transaction));
    mockTransactionCacheService.assertGetHasBeenCalledWith(transactionId);
  });

  it('should be called next handle because the transaction does not exist', async () => {
    mockTransactionCacheService.returnOnGet(null);
    context = {
      switchToRpc: () =>
        ({
          getContext: () => ({}),
          getData: jest.fn().mockReturnValue({ id: transactionId }),
        } as RpcArgumentsHost),
    };

    await transactionCacheInterceptor.intercept(
      context as ExecutionContext,
      next,
    );
    expect(next.handle).toHaveBeenCalledTimes(1);
    mockTransactionCacheService.assertGetHasBeenCalledWith(transactionId);
  });

  it('should be called next handle because invalid input data', async () => {
    context = {
      switchToRpc: () =>
        ({
          getContext: () => ({}),
          getData: jest.fn().mockReturnValue(undefined),
        } as RpcArgumentsHost),
    };

    await transactionCacheInterceptor.intercept(
      context as ExecutionContext,
      next,
    );
    expect(next.handle).toHaveBeenCalledTimes(1);
    mockTransactionCacheService.assertNotGetCalled();
  });
});
