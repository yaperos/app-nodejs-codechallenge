export interface RedisRepository {
  set(key: string, value: unknown): Promise<void>
  get(key: string): Promise<unknown | null>
}
