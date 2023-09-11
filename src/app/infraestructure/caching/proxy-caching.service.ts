import { Injectable, OnModuleInit } from '@nestjs/common';
import { of, Observable, switchMap } from 'rxjs';
import { CachingService } from '../../interface/caching.service.interface';
import { RedisCachingService } from './caching.service';
import { TransactionCache } from './transaction-cache'

//proxy with RedisCachingService
@Injectable()
export class ProxyCachingService implements CachingService, OnModuleInit {

  constructor(
    private readonly cachingService: RedisCachingService
  ) {}

  public async onModuleInit() {}


  public setTransactionDetail$(transferOrder: TransactionCache) {
    this.cachingService.setTransactionDetail$(transferOrder);
  }

  public getTransactionDetail$(id: string): Observable<TransactionCache> {
    return this.cachingService.getTransactionDetail$(id).pipe(
      switchMap((transaction) => {
        return of(transaction);
      })
    );
  }
}
