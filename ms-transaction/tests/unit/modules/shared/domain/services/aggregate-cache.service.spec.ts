import { AggregateCacheService } from 'src/modules/shared/domain/services/aggregate-cache.service';

import { UuidMother } from '../mothers';
import { MockCacheProvider } from '../providers/mock-cache.provider';
import { Test } from '../test';

describe('AggregateCacheService test', () => {
  const mockCacheProvider = new MockCacheProvider();
  const aggregateCacheService = new AggregateCacheService(mockCacheProvider);
  const aggregate = new Test(UuidMother.random());

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should test get with existing values', async () => {
    mockCacheProvider.returnOnGet(aggregate.toPrimitives());

    const aggregateKey = aggregate.getId();
    const aggregateValues = await aggregateCacheService.get(aggregateKey);

    expect(aggregateValues).toEqual(aggregate.toPrimitives());
    mockCacheProvider.assertGetHasBeenCalledWith(aggregateKey);
  });

  it('should test get with non-existent values', async () => {
    mockCacheProvider.returnOnGet(undefined);

    const aggregateKey = UuidMother.random();
    const aggregateValues = await aggregateCacheService.get(aggregateKey);

    expect(aggregateValues).toBeNull();
    mockCacheProvider.assertGetHasBeenCalledWith(aggregateKey);
  });

  it('should test set function', async () => {
    const aggregateKey = aggregate.getId();
    await aggregateCacheService.set(aggregateKey, aggregate);

    mockCacheProvider.assertSetHasBeenCalledWith(
      aggregateKey,
      aggregate.toPrimitives(),
    );
  });

  it('should test delete function', async () => {
    const aggregateKey = aggregate.getId();
    await aggregateCacheService.delete(aggregateKey);

    mockCacheProvider.assertDeleteHasBeenCalledWith(aggregateKey);
  });
});
