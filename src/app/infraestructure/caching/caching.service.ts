import { Inject, Injectable, Logger } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { TransactionCachingKeys } from '../../../util/enum/caching.enum';
import { from, Observable, tap } from 'rxjs';
import { TransactionCache } from './transaction-cache';
import { CachingService } from '../../interface/caching.service.interface';

@Injectable()
export class RedisCachingService implements CachingService {
  protected logger = new Logger(RedisCachingService.name);

  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  public getTransactionDetail$(id: string): Observable<TransactionCache> {
    const key = `${TransactionCachingKeys.TRANSACTION_YAPE}:${id}`;
    return from(this.cacheManager.get<TransactionCache>(key)).pipe(
      tap((product) => {
        if (!product) this.logger.warn(`key [${key}] don't found in cache`);
      })
    );
  }

  public setTransactionDetail$(transaction: TransactionCache){
    this.logger.log(`Setting transaction to Cache with: ${JSON.stringify(transaction)}`);
    const key = `${TransactionCachingKeys.TRANSACTION_YAPE}:${transaction.transactionExternalId}`;
    from(this.cacheManager.set(key, transaction, 60));
  }
}
