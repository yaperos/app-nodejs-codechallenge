import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { Prisma, Transaction } from '@prisma/client';

@Injectable()
export class TransactionService {
  constructor(private prisma: PrismaService) {}

  async createTransaction(data: Prisma.TransactionCreateInput) {
    return await this.prisma.transaction.create({ data });
  }

  async updateTransaction(
    where: Prisma.TransactionWhereUniqueInput,
    data: Prisma.TransactionUpdateInput,
  ) {
    return await this.prisma.transaction.update({ data, where });
  }

  async transaction(where: Prisma.TransactionWhereUniqueInput) {
    return await this.prisma.transaction.findUnique({ where });
  }
}
