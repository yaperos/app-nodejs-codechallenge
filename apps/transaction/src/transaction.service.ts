import { PrismaService } from '@app/prisma';
import { Injectable } from '@nestjs/common';
import { Transaction } from '@prisma/client';
import { TransactionModel } from './models/transaction.model';
import { TRANSACTION_STATUS } from '../../../libs/shared-constants';

@Injectable()
export class TransactionService {
  constructor(private readonly prismaService: PrismaService) {}

  async createTransaction({
    value,
    accountExternalIdCredit,
    accountExternalIdDebit,
    transactionTypeId,
  }: Partial<Transaction>): Promise<Partial<TransactionModel>> {
    return this.prismaService.transaction.create({
      data: {
        value,
        accountExternalIdCredit,
        accountExternalIdDebit,
        transactionType: {
          connect: {
            id: transactionTypeId,
          },
        },
      },
      include: {
        transactionStatus: {
          select: {
            id: true,
            name: true,
          },
        },
        transactionType: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  async findTransactionById(
    transactionExternalId: string,
  ): Promise<Partial<TransactionModel>> {
    return this.prismaService.transaction.findUnique({
      where: { transactionExternalId },
      include: {
        transactionStatus: {
          select: {
            id: true,
            name: true,
          },
        },
        transactionType: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  async updateTransaction(payload: {
    transactionExternalId: string;
    transactionStatus: TRANSACTION_STATUS;
  }) {
    return this.prismaService.transaction.update({
      where: {
        transactionExternalId: payload.transactionExternalId,
      },
      data: {
        transactionStatus: {
          connect: {
            name: payload.transactionStatus,
          },
        },
      },
    });
  }
}
