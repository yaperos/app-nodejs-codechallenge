import { PrismaClient } from '@prisma/client';

export interface TransactionRepository {
  create(transaction: any): Promise<any>;

  update(id: string, data: any): Promise<any>;

  findById(id: string): Promise<any>;
}
