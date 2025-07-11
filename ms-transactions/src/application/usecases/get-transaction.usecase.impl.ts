import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { GetTransactionUseCase } from '../../domain/usecases/get-transaction.usecase';
import { Transaction } from '../../domain/entities/transaction';
import { TransactionRepository } from '../../domain/repositories/transaction.repository';
import { CachedTransactionDTO } from '../../domain/dto/cached-transaction.dto';
import { CachedTransactionMapper } from '../../domain/mappers/cached-transaction.mapper';

@Injectable()
export class GetTransactionUseCaseImpl implements GetTransactionUseCase {
  constructor(
    @Inject('TransactionRepository')
    private readonly transactionRepository: TransactionRepository,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async execute(transactionId: string): Promise<Transaction> {
    try {
      const cached = await this.cacheManager.get<CachedTransactionDTO>(
        `transaction:${transactionId}`,
      );

      if (cached) {
        return CachedTransactionMapper.fromDTO(cached);
      }
    } catch (error) {
      console.error('Cache error:', error);
    }

    const transaction =
      await this.transactionRepository.findById(transactionId);

    if (!transaction) {
      throw new NotFoundException(
        `Transaction with id ${transactionId} not found`,
      );
    }

    try {
      await this.cacheManager.set(
        `transaction:${transaction.id}`,
        CachedTransactionMapper.toDTO(transaction),
        3600,
      );
    } catch (error) {
      console.error('Cache set error:', error);
    }

    return transaction;
  }
}
