import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Test, TestingModule } from '@nestjs/testing';
import { Cache } from 'cache-manager';
import { CacheManagerProvider as CacheProvider } from 'src/modules/shared/infrastructure/providers/cache-manager.provider';
import {
  ObjectMother,
  UuidMother,
} from 'tests/unit/modules/shared/domain/mothers';

import { CacheTestingModule } from '../../base';

describe('CacheManagerProvider test', () => {
  let testingModule: TestingModule;
  let cache: Cache;
  let cacheProvider: CacheProvider;

  beforeAll(async () => {
    testingModule = await Test.createTestingModule({
      imports: [...CacheTestingModule()],
      providers: [CacheProvider],
    }).compile();
    cache = testingModule.get<Cache>(CACHE_MANAGER);
    cacheProvider = testingModule.get(CacheProvider);
  });

  beforeEach(async () => {
    await cache.reset();
  });

  afterAll(async () => {
    await testingModule.close();
  });

  it('should return undefined because it does not exist', async () => {
    const storedData = await cacheProvider.get(UuidMother.random());
    expect(storedData).toBeUndefined();
  });

  it('should return existing data', async () => {
    const key = UuidMother.random();
    const data = ObjectMother.random();

    let storedData = await cacheProvider.get(key);
    expect(storedData).toBeUndefined();

    await cacheProvider.set(key, data);
    storedData = await cacheProvider.get(key);
    expect(storedData).toEqual(storedData);
  });

  it('should delete existing data', async () => {
    const key = UuidMother.random();
    const data = ObjectMother.random();

    await cacheProvider.set(key, data);
    let storedData = await cacheProvider.get(key);
    expect(storedData).toEqual(storedData);

    await cacheProvider.delete(key);
    storedData = await cacheProvider.get(key);
    expect(storedData).toBeUndefined();
  });

  it('should delete non-existent data', async () => {
    const key = UuidMother.random();

    let storedData = await cacheProvider.get(key);
    expect(storedData).toBeUndefined();

    await cacheProvider.delete(key);
    storedData = await cacheProvider.get(key);
    expect(storedData).toBeUndefined();
  });
});
