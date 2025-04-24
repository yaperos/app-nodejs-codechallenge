import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/modules/transaction/infrastructure/prisma/prisma.service';
import { RedisService } from '@/modules/transaction/infrastructure/redis/redis.service';
import { TransactionWithRelations } from '@/modules/transaction/domain/entities/transaction.types';

@Injectable()
export class FindTransactionUseCase {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

    async execute(transactionExternalId: string): Promise<TransactionWithRelations> {
      const cacheKey = `tx:${transactionExternalId}`;
      const cached = await this.redis.get<TransactionWithRelations>(cacheKey);
      if (cached) {
        cached.createdAt = new Date(cached.createdAt);
        return cached;
      }
    
      const transaction = await this.prisma.transaction.findUnique({
        where: { id: transactionExternalId },
        include: { transactionType: true, transactionStatus: true },
      });
    
      if (!transaction) throw new NotFoundException('Transaction not found');
    
      await this.redis.set(cacheKey, transaction);
      return transaction;
    }
}
