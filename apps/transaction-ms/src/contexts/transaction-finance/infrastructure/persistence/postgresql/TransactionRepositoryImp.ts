import { Injectable } from '@nestjs/common';
import { TransactionModel } from '../../../domain/models/transaction.model';
import { PrismaClientService } from '../../../../shared/infrastructure/prisma-client';
import { Transaction } from '../../../domain/Transaction';
import { TransactionRepository } from '../../../domain/TransactionRepository';

@Injectable()
export class TransactionRepositoryImp implements TransactionRepository {
  constructor(private prismaClient: PrismaClientService) {}

  async create(transaction: Transaction): Promise<Partial<TransactionModel>> {
    return this.prismaClient.transaction.create({
      data: {
        accountExternalIdDebit:
          transaction.toPrimitives().accountExternalIdDebit,
        accountExternalIdCredit:
          transaction.toPrimitives().accountExternalIdCredit,
        value: transaction.toPrimitives().value,
        transactionType: {
          connect: {
            id: transaction.toPrimitives().tranferTypeId,
          },
        },
      },
      include: {
        transactionStatus: {
          select: {
            name: true,
          },
        },
        transactionType: {
          select: {
            name: true,
          },
        },
      },
    });
  }

  async update(
    transactionId: string,
    transactionStatus: string,
  ): Promise<Partial<TransactionModel>> {
    return this.prismaClient.transaction.update({
      where: {
        transactionExternalId: transactionId,
      },
      data: {
        transactionStatus: {
          connect: {
            name: transactionStatus,
          },
        },
      },
    });
  }

  async find(transactionId: string): Promise<Partial<TransactionModel>> {
    return this.prismaClient.transaction.findUnique({
      where: {
        transactionExternalId: transactionId,
      },
      include: {
        transactionStatus: {
          select: {
            name: true,
          },
        },
        transactionType: {
          select: {
            name: true,
          },
        },
      },
    });
  }
}
