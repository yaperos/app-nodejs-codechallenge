import { RedisService } from '@app/common';
import { LoggerService } from '@app/observability';
import type { Transaction } from '@domain/entities/transaction.entity';
import {
    type ITransactionRepository,
    TRANSACTION_REPOSITORY,
} from '@domain/repositories/transaction.repository.interface';
import { TransactionStatus } from '@domain/value-objects/transaction-status.vo';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';

import type { IUpdateTransactionStatusUseCase } from '../../domain/ports/input/update-transaction-status.use-case.interface';

@Injectable()
export class UpdateTransactionStatusUseCase implements IUpdateTransactionStatusUseCase {
    constructor(
        @Inject(TRANSACTION_REPOSITORY)
        private readonly transactionRepository: ITransactionRepository,
        private readonly logger: LoggerService,
        private readonly redisService: RedisService,
    ) {}

    async execute(transactionExternalId: string, status: TransactionStatus): Promise<Transaction> {
        const transaction = await this.transactionRepository.findByExternalId(transactionExternalId);

        if (!transaction) {
            throw new NotFoundException(`Transaction with id ${transactionExternalId} not found`);
        }

        if (status === TransactionStatus.APPROVED) {
            transaction.approve();
        } else if (status === TransactionStatus.REJECTED) {
            transaction.reject();
        }

        const updatedTransaction = await this.transactionRepository.update(transaction);

        const cacheKey = `transaction:${transactionExternalId}`;
        await this.redisService.set(cacheKey, updatedTransaction, 600);

        this.logger.log(`Transaction ${status}: ${transactionExternalId}`, undefined, {
            transactionId: transactionExternalId,
            status,
        });

        return updatedTransaction;
    }
}
