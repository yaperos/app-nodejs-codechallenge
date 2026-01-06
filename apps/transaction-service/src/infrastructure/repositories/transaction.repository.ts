import { DRIZZLE_CLIENT, type DrizzleClient } from '@app/common';
import { Transaction } from '@domain/entities/transaction.entity';
import type { ITransactionRepository } from '@domain/repositories/transaction.repository.interface';
import type { TransactionStatus } from '@domain/value-objects/transaction-status.vo';
import { Inject, Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { transactions } from '../database/schema';

@Injectable()
export class TransactionRepository implements ITransactionRepository {
    constructor(
        @Inject(DRIZZLE_CLIENT)
        private readonly db: DrizzleClient,
    ) {}

    async save(transaction: Transaction): Promise<Transaction> {
        const [result] = await this.db
            .insert(transactions)
            .values({
                transactionExternalId: transaction.transactionExternalId,
                accountExternalIdDebit: transaction.accountExternalIdDebit,
                accountExternalIdCredit: transaction.accountExternalIdCredit,
                transferTypeId: transaction.transferTypeId,
                value: transaction.value.toString(),
                transactionStatus: transaction.transactionStatus,
                createdAt: transaction.createdAt,
            })
            .returning();

        return this.mapToDomain(result);
    }

    async findByExternalId(externalId: string): Promise<Transaction | null> {
        const [result] = await this.db
            .select()
            .from(transactions)
            .where(eq(transactions.transactionExternalId, externalId))
            .limit(1);

        if (!result) {
            return null;
        }

        return this.mapToDomain(result);
    }

    async update(transaction: Transaction): Promise<Transaction> {
        const [result] = await this.db
            .update(transactions)
            .set({
                transactionStatus: transaction.transactionStatus,
            })
            .where(eq(transactions.transactionExternalId, transaction.transactionExternalId))
            .returning();

        return this.mapToDomain(result);
    }

    private mapToDomain(data: any): Transaction {
        return new Transaction(
            data.transactionExternalId,
            data.accountExternalIdDebit,
            data.accountExternalIdCredit,
            data.transferTypeId,
            parseFloat(data.value),
            data.transactionStatus as TransactionStatus,
            data.createdAt,
        );
    }
}
