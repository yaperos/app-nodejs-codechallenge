export interface CachePort {
  getJson<T>(key: string): Promise<T | null>;
  setJson<T>(key: string, value: T, ttl: number): Promise<void>;
  del(key: string): Promise<void>;
}

export const CACHE_PORT = Symbol('CACHE_PORT');