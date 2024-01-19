import { AggregateRoot } from 'src/modules/shared/domain/aggregate-root';
import { CacheProvider } from 'src/modules/shared/domain/providers/cache.provider';
import { AggregateCacheService } from 'src/modules/shared/domain/services/aggregate-cache.service';

export class MockAggregateCacheService<
  T extends AggregateRoot,
> extends AggregateCacheService<T> {
  private mockGet = jest.fn();
  private mockSet = jest.fn();
  private mockDelete = jest.fn();

  private aggregatePrimitive: any;

  public constructor() {
    const cacheProvider: Partial<CacheProvider> = {};
    super(cacheProvider as CacheProvider);
  }

  returnOnGet(aggregatePrimitive: any) {
    this.aggregatePrimitive = aggregatePrimitive;
  }

  async get(aggregateKey: string): Promise<any | null> {
    this.mockGet(aggregateKey);
    return this.aggregatePrimitive;
  }

  assertGetHasBeenCalledWith(aggregateKey: string) {
    expect(this.mockGet).toHaveBeenCalledWith(aggregateKey);
  }

  async set(aggregateKey: string, aggregate: T): Promise<void> {
    this.mockSet(aggregateKey, aggregate);
  }

  assertSetHasBeenCalledWith(aggregateKey: string, aggregate: T) {
    expect(this.mockSet).toHaveBeenCalledWith(...[aggregateKey, aggregate]);
  }

  async delete(aggregateKey: string): Promise<void> {
    this.mockDelete(aggregateKey);
  }

  assertDeleteHasBeenCalledWith(aggregateKey: string) {
    expect(this.mockDelete).toHaveBeenCalledWith(aggregateKey);
  }
}
