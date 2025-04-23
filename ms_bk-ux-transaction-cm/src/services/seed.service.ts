import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaService } from 'src/config/db/db-client';

@Injectable()
export class SeedService implements OnModuleInit {
  constructor(private readonly prisma: PrismaService) {}

  async onModuleInit() {
    const transactionsTypes = await this.prisma.transactionType.findMany();
    if (!transactionsTypes?.length) {
      await this.seedTransactionTypes();
    }

    const transactionsStatus = await this.prisma.transactionStatus.findMany();
    if (!transactionsStatus?.length) {
      await this.seedTransactionsStatus();
    }
  }

  seedTransactionTypes() {
    return this.prisma.transactionType.createMany({
      data: [
        {
          name: 'Tipo 1',
        },
        {
          name: 'Tipo 2',
        },
      ],
    });
  }

  seedTransactionsStatus() {
    return this.prisma.transactionStatus.createMany({
      data: [
        {
          name: 'PENDING',
        },
        {
          name: 'APPROVED',
        },
        {
          name: 'REJECTED',
        },
      ],
    });
  }
}
