import { Injectable } from '@nestjs/common';
import { Prisma, Transaction } from '@prisma/client';
import { PrismaService } from '../../../infrastructure/persistence/prisma/prisma.service';

@Injectable()
export class TransactionRepository {
  constructor(private prisma: PrismaService) {}

  async getById(id: string) {
    return await this.prisma.transaction.findUnique({
      where: {
        id,
      },
    });
  }

  async getByIdRaw(id: string) {
    return await this.prisma.$queryRaw`
      select t.id, t.value, t."createdAt",
      (select ts.name from transaction_statuses ts where ts.id = t."transactionStatusId") as "transactionStatus",
      (select tt.name from transaction_types tt where tt.id = t."transactionTypeId") as "transactionType"
      from transactions t
      where t.id = ${id}
      `;
  }

  async create(
    data: Prisma.TransactionUncheckedCreateInput,
  ): Promise<Transaction> {
    return await this.prisma.transaction.create({
      data,
    });
  }

  async updateOcc(
    id: string,
    version: number,
    data: Prisma.TransactionUncheckedUpdateInput,
  ) {
    return await this.prisma.transaction.updateMany({
      data: {
        ...data,
        version: {
          increment: 1,
        },
      },
      where: {
        id,
        version,
      },
    });
  }
}
