import { RedisService } from '@app/common';
import type { Transaction } from '@domain/entities/transaction.entity';
import {
    type ITransactionRepository,
    TRANSACTION_REPOSITORY,
} from '@domain/repositories/transaction.repository.interface';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';

import type { IGetTransactionUseCase } from '../../domain/ports/input/get-transaction.use-case.interface';

@Injectable()
export class GetTransactionUseCase implements IGetTransactionUseCase {
    constructor(
        @Inject(TRANSACTION_REPOSITORY)
        private readonly transactionRepository: ITransactionRepository,
        private readonly redisService: RedisService,
    ) {}

    async execute(transactionExternalId: string): Promise<Transaction> {
        const cacheKey = `transaction:${transactionExternalId}`;
        const cached = await this.redisService.get<Transaction>(cacheKey);

        if (cached) {
            return {
                ...cached,
                createdAt: new Date(cached.createdAt),
            } as Transaction;
        }

        const transaction = await this.transactionRepository.findByExternalId(transactionExternalId);

        if (!transaction) {
            throw new NotFoundException(`Transaction with id ${transactionExternalId} not found`);
        }

        await this.redisService.set(cacheKey, transaction, 600);

        return transaction;
    }
}
