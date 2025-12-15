import { PrismaClient } from '@prisma/client';
import { Transaction } from '../entities/transaction.entity';

export class TransactionRepository {
  private prisma = new PrismaClient();

  async save(transaction: Transaction) {
    return this.prisma.transaction.create({
      data: {
        id: transaction.id,
        accountExternalIdDebit: transaction.accountExternalIdDebit,
        accountExternalIdCredit: transaction.accountExternalIdCredit,
        tranferTypeId: transaction.tranferTypeId,
        value: transaction.value,
        status: transaction.status,
        createdAt: transaction.createdAt,
      },
    });
  }

  async updateStatus(id: string, status: 'pending' | 'approved' | 'rejected') {
    return this.prisma.transaction.update({
      where: { id },
      data: { status },
    });
  }

  async getById(id: string): Promise<Transaction | null> {
    const t = await this.prisma.transaction.findUnique({ where: { id } });
    if (!t) return null;
    return new Transaction(
      t.id,
      t.accountExternalIdDebit,
      t.accountExternalIdCredit,
      t.tranferTypeId,
      t.value,
      t.status as 'pending' | 'approved' | 'rejected',
      t.createdAt,
    );
  }
}