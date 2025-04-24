import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { TransactionRepository } from '@/modules/transaction/domain/repositories/transaction.repository';
import { Transaction } from '@/modules/transaction/domain/entities/transaction.entity';

@Injectable()
export class TransactionRepositoryImpl implements TransactionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<Transaction | null> {
    return this.prisma.transaction.findUnique({
      where: { id },
      include: {
        transactionType: true,
        transactionStatus: true,
      },
    });
  }

  async save(transaction: Transaction): Promise<Transaction> {
    return this.prisma.transaction.create({
      data: {
        id: transaction.id,
        accountExternalIdDebit: transaction.accountExternalIdDebit,
        accountExternalIdCredit: transaction.accountExternalIdCredit,
        transferTypeId: transaction.transferTypeId,
        value: transaction.value,
        transactionStatusId: transaction.transactionStatusId,
      },
    });
  }

  async updateStatus(id: string, statusId: number): Promise<Transaction> {
    return this.prisma.transaction.update({
      where: { id },
      data: { transactionStatusId: statusId },
    });
  }
}
