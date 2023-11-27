import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Cache } from 'cache-manager';
import { TransactionType } from 'src/domain/entities/transaction-type.entity';
import { DataAccessService } from 'src/infra/cache/data-access.service';
import { Repository } from 'typeorm';

@Injectable()
export class TransactionTypeService extends DataAccessService {
  constructor(
    @InjectRepository(TransactionType)
    private transactionTypeRepository: Repository<TransactionType>,
    @Inject(CACHE_MANAGER)
    protected cacheManager: Cache,
    protected configService: ConfigService,
  ) {
    super(
      cacheManager,
      configService,
      'transaction_type',
      TransactionTypeService.name,
    );
  }

  async getById(id: number): Promise<TransactionType | null> {
    const itemCacheKey = this.cacheKey(id.toString());
    const dbQuery = async function () {
      return await this.transactionTypeRepository.findOneBy({ id });
    };

    return await this.findOrFetchFromDatabase<TransactionType>(
      itemCacheKey,
      dbQuery.bind(this),
    );
  }
}
