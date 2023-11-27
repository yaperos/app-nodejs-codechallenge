import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Cache } from 'cache-manager';
import { TransactionStatus } from 'src/domain/entities/transaction-status.entity';
import { DataAccessService } from 'src/infra/cache/data-access.service';
import { Repository } from 'typeorm';

@Injectable()
export class TransactionStatusService extends DataAccessService {
  constructor(
    @InjectRepository(TransactionStatus)
    private transactionStatusRepository: Repository<TransactionStatus>,
    @Inject(CACHE_MANAGER)
    protected cacheManager: Cache,
    protected configService: ConfigService,
  ) {
    super(
      cacheManager,
      configService,
      'transaction_status',
      TransactionStatusService.name,
    );
  }

  async getByName(name: string): Promise<TransactionStatus | null> {
    const itemCacheKey = this.cacheKey(name);
    const dbQuery = async function () {
      return await this.transactionStatusRepository.findOneBy({
        name,
      });
    };

    return await this.findOrFetchFromDatabase<TransactionStatus>(
      itemCacheKey,
      dbQuery.bind(this),
    );
  }
}
