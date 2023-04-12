import NodeCache from "node-cache";
import { ECacheCollection, ICacheService } from ".";

export class CacheService implements ICacheService {
  private static _instance: CacheService;
  private _cacheServer: NodeCache;
  private _ttl: number;

  public static getInstance(ttl?: number): CacheService {
    if (CacheService._instance) {
      return CacheService._instance;
    }

    CacheService._instance = new CacheService();
    CacheService._instance._cacheServer = new NodeCache();
    if (ttl) {
      CacheService._instance._ttl = ttl;
    }
    return CacheService._instance;
  }

  private _getCacheKey(
    collection: ECacheCollection,
    key: NodeCache.Key
  ): NodeCache.Key {
    return `${collection}&${key}`;
  }

  set<T>(
    collection: ECacheCollection,
    key: NodeCache.Key,
    value: T,
    ttl = this._ttl
  ): boolean {
    return this._cacheServer.set(
      this._getCacheKey(collection, key),
      value,
      ttl
    );
  }

  get<T>(collection: ECacheCollection, key: NodeCache.Key): T | undefined {
    return this._cacheServer.get(this._getCacheKey(collection, key));
  }

  take<T>(collection: ECacheCollection, key: NodeCache.Key): T | undefined {
    return this._cacheServer.take(this._getCacheKey(collection, key));
  }

  delete(
    collection: ECacheCollection,
    keys: NodeCache.Key | NodeCache.Key[]
  ): number {
    const deletedKeys: NodeCache.Key | NodeCache.Key[] = Array.isArray(keys)
      ? keys.map((k) => this._getCacheKey(collection, k))
      : this._getCacheKey(collection, keys);

    return this._cacheServer.del(deletedKeys);
  }

  has(collection: ECacheCollection, key: NodeCache.Key): boolean {
    return this._cacheServer.has(this._getCacheKey(collection, key));
  }
}
