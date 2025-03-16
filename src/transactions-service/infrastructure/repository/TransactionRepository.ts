import prisma from '../../../config/prisma.config';
import { Transaction } from '../../domain/Transaction';
import { ITransactionRepository } from '../../domain/ITransactionRepository';

export class TransactionRepository implements ITransactionRepository {
    async create(transaction: Transaction): Promise<any> {
        return await prisma.transaction.create({
            data: {
                id: transaction.id,
                accountExternalIdDebit: transaction.accountExternalIdDebit,
                accountExternalIdCredit: transaction.accountExternalIdCredit,
                tranferTypeId: transaction.tranferTypeId,
                value: transaction.value,
                statusId: transaction.status === 'pending' ? 1 : transaction.status === 'approved' ? 2 : 3,
                createdAt: transaction.createdAt
            }
        });
    }

    async getById(id: string): Promise<any | null> {
        return await prisma.transaction.findUnique({
            where: { id }
        });
    }   

    async updateTransactionStatus(transaction: Transaction): Promise<any | null> {
        return await prisma.transaction.update({
            where: { id: transaction.id },
            data: { statusId: transaction.status === 'approved' ? 2 : 3 }
        });
    }
}
