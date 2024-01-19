export const CACHE_PROVIDER_ALIAS = Symbol('CacheProvider');

export interface CacheProvider {
  get(key: string): Promise<any>;
  set(key: string, data: any): Promise<void>;
  delete(key: string): Promise<void>;
}
