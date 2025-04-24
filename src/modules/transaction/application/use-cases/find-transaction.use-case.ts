import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/modules/transaction/infrastructure/prisma/prisma.service';
import { RedisService } from '@/modules/transaction/infrastructure/redis/redis.service';
import { TransactionWithRelations } from '@/modules/transaction/domain/entities/transaction.types';

/**
 * Use case responsible for retrieving a transaction by its external ID.
 * It uses Redis as a cache layer and falls back to the database if not found.
 */
@Injectable()
export class FindTransactionUseCase {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  /**
   * Executes the find transaction logic.
   * 
   * @param transactionExternalId - The external ID of the transaction to be retrieved.
   * @returns The transaction data including type and status.
   * @throws NotFoundException if the transaction is not found in the database.
   */
    async execute(transactionExternalId: string): Promise<TransactionWithRelations> {
      const cacheKey = `tx:${transactionExternalId}`;
      // Check Redis cache first
      const cached = await this.redis.get<TransactionWithRelations>(cacheKey);
      if (cached) {
        // Convert stringified date back to Date object
        cached.createdAt = new Date(cached.createdAt);
        return cached;
      }
    
      // Fallback to database query
      const transaction = await this.prisma.transaction.findUnique({
        where: { id: transactionExternalId },
        include: { transactionType: true, transactionStatus: true },
      });
    
      if (!transaction) throw new NotFoundException('Transaction not found');
      
      // Cache the result for future access
      await this.redis.set(cacheKey, transaction);
      return transaction;
    }
}
