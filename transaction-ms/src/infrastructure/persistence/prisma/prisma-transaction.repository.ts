import { Inject, Injectable } from '@nestjs/common';
import { Transaction } from '../../../domain/entities/transaction.entity';
import { TransactionRepositoryPort } from '../../../domain/ports/transaction.repository.port';
import { type DbClient, PrismaService } from './prisma.service';
import { TransactionStatus } from '../../../domain/enum/transaction-status.enum';

@Injectable()
export class PrismaTransactionRepository extends TransactionRepositoryPort {
    constructor(@Inject(PrismaService) private readonly db: DbClient) {
        super();
    }

    async save(transaction: Transaction): Promise<void> {
        const s = transaction.toSnapshot();
        await this.db.transaction.create({
            data: {
                id: s.id,
                accountExternalIdDebit: s.accountExternalIdDebit,
                accountExternalIdCredit: s.accountExternalIdCredit,
                transferTypeId: s.transferTypeId,
                value: s.value,
                status: s.status,
                createdAt: s.createdAt,
            },
        });
    }

    async update(transaction: Transaction): Promise<void> {
        const s = transaction.toSnapshot();
        await this.db.transaction.update({ where: { id: s.id }, data: { status: s.status } });
    }

    async findById(id: string): Promise<Transaction | null> {
        const row = await this.db.transaction.findUnique({ where: { id } });
        if (!row) return null;
        return Transaction.restore({
            id: row.id,
            accountExternalIdDebit: row.accountExternalIdDebit,
            accountExternalIdCredit: row.accountExternalIdCredit,
            transferTypeId: row.transferTypeId,
            value: row.value.toNumber(),
            status: row.status as TransactionStatus,
            createdAt: row.createdAt,
            updatedAt: row.updatedAt,
        });
    }
}