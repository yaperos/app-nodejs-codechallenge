import { Injectable } from '@nestjs/common';
import { STATUS_TRANSACTION } from 'src/config/constants';
import { PrismaService } from 'src/config/db-client';
import { TransactionCreate } from 'src/types/transaction.types';

@Injectable()
export class TransactionRepository {
  constructor(public readonly prisma: PrismaService) {}

  async createTransaction(transaction: TransactionCreate) {
    return this.prisma.transaction.create({
      data: {
        accountDebit: transaction.accountExternalIdDebit,
        accountCredit: transaction.accountExternalIdCredit,
        value: transaction.value,
        transferTypeId: transaction.transferTypeId,
        statusId: STATUS_TRANSACTION.PENDING,
      },
      include: {
        transferType: true,
        status: true,
      },
    });
  }

  async updateTransactionStatus(transactionId: string, status: number) {
    return this.prisma.transaction.update({
      where: {
        id: transactionId,
      },
      data: {
        statusId: status,
      },
      include: {
        status: true,
        transferType: true,
      },
    });
  }
}
