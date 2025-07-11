import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { UpdateTransactionStatusUseCase } from '../../domain/usecases/update-transaction-status.usecase';
import { TransactionRepository } from '../../domain/repositories/transaction.repository';
import { TransactionStatus } from '../../domain/enums/transaction.enums';
import { CachedTransactionDTO } from '../../domain/dto/cached-transaction.dto';

@Injectable()
export class UpdateTransactionStatusUseCaseImpl
  implements UpdateTransactionStatusUseCase
{
  constructor(
    @Inject('TransactionRepository')
    private readonly transactionRepository: TransactionRepository,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async execute(
    transactionExternalId: string,
    status: TransactionStatus,
  ): Promise<void> {
    await this.transactionRepository.updateStatus(
      transactionExternalId,
      status,
    );

    try {
      const cachedTransaction =
        await this.cacheManager.get<CachedTransactionDTO>(
          `transaction:${transactionExternalId}`,
        );

      if (cachedTransaction) {
        cachedTransaction.status = status;
        await this.cacheManager.set(
          `transaction:${transactionExternalId}`,
          cachedTransaction,
          3600,
        );
      }
    } catch (error) {
      console.error('Cache update error:', error);
    }
  }
}
