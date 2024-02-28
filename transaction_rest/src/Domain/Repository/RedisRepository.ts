export interface RedisInterfaceRepository {
  getDataCache(key: string): Promise<object>;
  setDataCache(key: string, data: object): Promise<void>;
  deleteDataCache(key: string): Promise<void>;
}
