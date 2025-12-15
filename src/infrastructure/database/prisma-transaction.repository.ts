import { PrismaClient } from '@prisma/client';
import { TransactionRepository } from '../../domain/repositories/transaction.repository';
import { Transaction } from '../../domain/entities/transaction.entity';


export class PrismaTransactionRepository
  implements TransactionRepository {

  constructor(private prisma = new PrismaClient()) {}

  async save(transaction: Transaction): Promise<void> {
    await this.prisma.transaction.create({
      data: {
        id: transaction.id,
        amount: transaction.amount,
        createdAt: transaction.createdAt,
      },
    });
  }
}