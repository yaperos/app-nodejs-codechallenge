import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '@src/core/services/prisma.services';

@Injectable()
export class TransactionServices {
  constructor(private prisma: PrismaService) {}

  public transactions() {
    return this.prisma.transaction.findMany({
      orderBy: {
        createdAt: 'asc',
      },
    });
  }

  public transaction(id: string) {
    return this.prisma.transaction.findUnique({ where: { id } });
  }

  public createTransaction(data: Prisma.TransactionCreateInput) {
    return this.prisma.transaction.create({ data });
  }
}
