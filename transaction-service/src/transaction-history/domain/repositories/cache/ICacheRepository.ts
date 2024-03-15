export abstract class ICacheRepository {
  abstract set(key: string, data: any, ttl?: number): Promise<void>;
  abstract get(key: string): Promise<any>;
  abstract delete(key: string): void;
}
