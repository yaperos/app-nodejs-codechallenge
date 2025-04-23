import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/config/db-client';
import { Transaction } from 'src/models/transaction.model';

@Injectable()
export class TransactionRepository {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<Transaction[]> {
    return await this.prisma.transaction.findMany();
  }

  async findByExternalId(externalId: string): Promise<Transaction | null> {
    return await this.prisma.transaction.findUnique({
      where: {
        externalId,
      },
    });
  }

  async create(data: any): Promise<Transaction> {
    return await this.prisma.transaction.create({
      data,
    });
  }

  async update(id: string, data: any): Promise<Transaction> {
    return await this.prisma.transaction.update({
      where: {
        externalId: id,
      },
      data,
    });
  }
}
