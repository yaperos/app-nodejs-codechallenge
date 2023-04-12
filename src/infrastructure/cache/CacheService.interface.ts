import NodeCache from "node-cache";

export interface ICacheService {
  set<T>(
    collection: ECacheCollection,
    key: NodeCache.Key,
    value: T,
    ttl?: number
  ): boolean;
  get<T>(collection: ECacheCollection, key: NodeCache.Key): T | undefined;
  take<T>(collection: ECacheCollection, key: NodeCache.Key): T | undefined;
  delete(
    collection: ECacheCollection,
    keys: NodeCache.Key | NodeCache.Key[]
  ): number;
  has(collection: ECacheCollection, key: NodeCache.Key): boolean;
}

export enum ECacheCollection {
  transactions = "transactions",
}
