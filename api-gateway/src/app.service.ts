import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Cache } from 'cache-manager';
import { map } from 'rxjs';
import { CreateTransactionRequest } from './app.request';
@Injectable()
export class AppService {
  constructor(
    @Inject('TRANSACTION_QUERY') private transactionQueryClient: ClientProxy,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}
  create(transaction) {
    return new CreateTransactionRequest(transaction);
  }
  findAll() {
    return this.transactionQueryClient
      .send('find_all_transactions', '')
      .pipe(map((message: any) => message));
  }
  async findOne(id: string) {
    const cache = await this.cacheManager.get(id);
    if (!cache) {
      return this.transactionQueryClient
        .send('find_one_transactions', '')
        .pipe(map((message: any) => message));
    }
    return cache;
  }
}
