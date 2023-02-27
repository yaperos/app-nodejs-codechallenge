import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../infrastructure/persistence/prisma/prisma.service';

@Injectable()
export class TransactionRepository {
  constructor(private prisma: PrismaService) {}

  async getById(id: string) {
    return await this.prisma.transaction.findUnique({
      where: {
        id,
      },
      include: {
        transactionType: {
          select: {
            id: true,
            name: true,
          },
        },
        transactionStatus: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  async create(data: Prisma.TransactionUncheckedCreateInput) {
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
