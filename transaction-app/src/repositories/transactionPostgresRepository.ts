import { PrismaClient } from '@prisma/client';
import { TransactionRepository } from '../contracts/transactionRepository';

export class TransactionPostgresRepository implements TransactionRepository {
  prisma: any;
  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async create(transaction: any): Promise<any> {
    return this.prisma.transactions.create({ data: transaction });
  }

  async update(id: string, data: any): Promise<any> {
    return this.prisma.transactions.update({
      where: { id: id },
      data: data,
    });
  }

  async findById(id: string): Promise<any> {
    return this.prisma.transactions.findOne({ where: { id: id } });
  }
}
