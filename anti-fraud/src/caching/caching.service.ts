import { Inject, Injectable } from '@nestjs/common';
import { Cache, Store, memoryStore } from "cache-manager";
import { TransactionToValidate } from '../dto/transactionToValidate.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class CachingService {
  private store: Store;
  constructor(
    @Inject(CACHE_MANAGER) private cacheService: Cache

  ){
    this.store = memoryStore({ttl:0})
  }
  async setData(id: string, data: TransactionToValidate) {
    return await this.store.set(id, data, 0);
}

async getData(id: string): Promise<TransactionToValidate> {
    const response: TransactionToValidate = await this.store.get(id)
    return response
}

async delData(id: string) {
    return await this.store.del(id)
}
async storedKeys() {
    return await this.store.keys();
}
async delAllData() {
    const keys: string[] = await this.storedKeys()
    for(const key of keys){
        await this.store.del(key);
    }
    return
}
async getAllData() {
    const keys: string[] = await this.storedKeys();
    const allData: Array<TransactionToValidate> = []
    for(const key of keys) {
        const data: TransactionToValidate = await this.getData(key);
        allData.push(data);
    }
    return allData

}
}