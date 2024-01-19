import { AggregateCacheService } from 'src/modules/shared/domain/services/aggregate-cache.service';
import { TransactionCacheService } from 'src/modules/transaction/domain/services/transaction-cache.service';
import { Transaction } from 'src/modules/transaction/domain/transaction';

export class MockTransactionCacheService extends TransactionCacheService {
  private mockGet = jest.fn();
  private mockSet = jest.fn();
  private mockDelete = jest.fn();

  private transaction: Transaction;

  public constructor() {
    const aggregateCacheService: Partial<AggregateCacheService<any>> = {};
    super(aggregateCacheService as AggregateCacheService<any>);
  }

  returnOnGet(transaction: Transaction) {
    this.transaction = transaction;
  }

  async get(transactionId: string): Promise<Transaction | null> {
    this.mockGet(transactionId);
    return this.transaction;
  }

  assertGetHasBeenCalledWith(transactionId: string) {
    expect(this.mockGet).toHaveBeenCalledWith(transactionId);
  }

  assertNotGetCalled() {
    expect(this.mockGet).toHaveBeenCalledTimes(0);
  }

  async set(transaction: Transaction): Promise<void> {
    this.mockSet(transaction);
  }

  assertSetHasBeenCalledWith(transaction: Transaction) {
    expect(this.mockSet).toHaveBeenCalledWith(transaction);
  }

  assertNotSetCalled() {
    expect(this.mockSet).toHaveBeenCalledTimes(0);
  }

  async delete(transactionId: string): Promise<void> {
    this.mockDelete(transactionId);
  }

  assertDeleteHasBeenCalledWith(transactionId: string) {
    expect(this.mockDelete).toHaveBeenCalledWith(transactionId);
  }
}
