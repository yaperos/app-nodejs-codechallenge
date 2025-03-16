import prisma from '../../../config/prisma.config';
import { Transaction } from '../../domain/Transaction';
import { ITransactionRepository } from '../../domain/ITransactionRepository';

export class TransactionRepository implements ITransactionRepository {

    async create(transaction: Transaction): Promise<Transaction> {
        const createdTransaction = await prisma.transaction.create({
            data: {
                id: transaction.id,
                accountExternalIdDebit: transaction.accountExternalIdDebit,
                accountExternalIdCredit: transaction.accountExternalIdCredit,
                tranferTypeId: transaction.tranferTypeId,
                value: transaction.value,
                statusId: transaction.status === 'pending' ? 1 : 2,
                createdAt: transaction.createdAt
            }
        });

        return new Transaction(
            createdTransaction.id,
            createdTransaction.accountExternalIdDebit,
            createdTransaction.accountExternalIdCredit,
            createdTransaction.tranferTypeId,
            createdTransaction.value,
            createdTransaction.statusId === 1 ? 'pending' : 'approved',
            createdTransaction.createdAt
        );
    }

    async getById(id: string): Promise<Transaction | null> {
        const foundTransaction = await prisma.transaction.findUnique({
            where: { id }
        });

        if (!foundTransaction) return null;

        return new Transaction(
            foundTransaction.id,
            foundTransaction.accountExternalIdDebit,
            foundTransaction.accountExternalIdCredit,
            foundTransaction.tranferTypeId,
            foundTransaction.value,
            foundTransaction.statusId === 1 ? 'pending' : 'approved',
            foundTransaction.createdAt
        );
    }

    async updateTransactionStatus(transaction: Transaction): Promise<Transaction | null> {
        const updatedTransaction = await prisma.transaction.update({
            where: { id: transaction.id },
            data: { statusId: transaction.status === 'approved' ? 2 : 3 } // 2 = Aprobado, 3 = Rechazado
        });

        return new Transaction(
            updatedTransaction.id,
            updatedTransaction.accountExternalIdDebit,
            updatedTransaction.accountExternalIdCredit,
            updatedTransaction.tranferTypeId,
            updatedTransaction.value,
            updatedTransaction.statusId === 2 ? 'approved' : 'rejected',
            updatedTransaction.createdAt
        );
    }
}
