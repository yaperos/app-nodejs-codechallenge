import { Inject } from '@nestjs/common';
import { RedisInterfaceRepository } from '../Repository';

export class RedisDomainService {
  constructor(
    @Inject('RedisInterfaceRepository')
    private readonly redisInterfaceRepository: RedisInterfaceRepository,
  ) {}

  async getDataCache(key: string): Promise<object> {
    return this.redisInterfaceRepository.getDataCache(key);
  }
  async setDataCache(key: string, data: object): Promise<void> {
    return this.redisInterfaceRepository.setDataCache(key, data);
  }
  async deleteDataCache(key: string): Promise<void> {
    return this.redisInterfaceRepository.deleteDataCache(key);
  }
}
