import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetTransactionQuery } from './get.transaction.query';
import { Transaction } from 'src/entities/transaction.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CACHE_MANAGER, Inject } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { TransactionStatus } from 'src/common/transaction.enum';

@QueryHandler(GetTransactionQuery)
export class GetTransactionQueryHandler
  implements IQueryHandler<GetTransactionQuery, Transaction>
{
  constructor(
    @InjectRepository(Transaction) private transactionRepository: Repository<Transaction>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) {}
  async execute(query: GetTransactionQuery): Promise<Transaction> {
    const transactionExternalId = query.transactionExternalId;
    const cachedTransaction = await this.cacheManager.get<Transaction>(transactionExternalId)

    if(cachedTransaction) {
      return cachedTransaction
    }

    const transaction = await this.transactionRepository.findOne({ where: { transactionExternalId } });

    await this.cacheManager.set(transaction.transactionExternalId, transaction, 30) 

    return transaction;
  }
}
