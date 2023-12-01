import { Injectable } from '@nestjs/common';
import {
  FindTransactionsQuery,
  TransactionRepository,
} from '../../domain/TransactionRepository';
import { PrismaService } from 'src/Shared/infrastructure/persistence/PrismaService';
import { Transaction } from 'src/modules/transaction/domain/Transaction';
import { IPageInfo } from 'src/Shared/adapters/interfaces/PageInfo';

@Injectable()
export class TransactionPrismaRepository implements TransactionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findManyPaginated(
    query: FindTransactionsQuery,
  ): Promise<IPageInfo<Transaction>> {
    const where = {};
    const take = query.pagination?.take || 10;
    const skip = query.pagination?.skip || 0;
    const response = await this.prisma.transaction.findMany({
      where: query.params,
      take,
      skip,
      orderBy: {
        createdAt: 'desc',
      },
    });

    const total = await this.prisma.transaction.count({
      where,
    });

    return {
      items: response.map((item) => Transaction.fromPrimitive(item)),
      count: response.length || 0,
      total,
    };
  }

  async findById(transactionId: number): Promise<Transaction> {
    const response = await this.prisma.transaction.findFirstOrThrow({
      where: {
        id: transactionId,
      },
    });

    return Transaction.fromPrimitive(response);
  }

  async create(data: Transaction): Promise<Transaction> {
    const response = await this.prisma.transaction.create({
      data: Transaction.toPrimitives(data),
    });
    return Transaction.fromPrimitive(response);
  }

  async save(data: Transaction): Promise<Transaction> {
    const payload = PrismaService.removeInvalidsProperties(
      Transaction.toPrimitives(data),
    );
    const response = await this.prisma.transaction.update({
      where: { id: data.getId() },
      data: { ...payload },
    });
    return Transaction.fromPrimitive(response);
  }
}
