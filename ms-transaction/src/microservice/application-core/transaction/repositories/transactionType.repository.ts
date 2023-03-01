import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/persistence/prisma/prisma.service';

@Injectable()
export class TransactionTypeRepository {
  constructor(private prisma: PrismaService) {}

  async getById(id: number) {
    return await this.prisma.transactionType.findUnique({
      where: {
        id,
      },
    });
  }
}
