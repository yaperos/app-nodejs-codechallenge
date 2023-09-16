import { BaseTransaction, Transaction, TypeTransaction } from "./transactions.interface";
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient();

class Transactions {
  async getTransaction(id: string): Promise<Transaction> {
    const [ transaction ] = await prisma.transaction.findMany({ where: { id }});
    return transaction;
  };
  async getType(id: number): Promise<TypeTransaction> {
    const [ type ] = await prisma.transactionType.findMany({ where: { id }});
    return type;
  };
  async createTransaction(transaction: any): Promise<Transaction> {
    const created = await prisma.transaction.create({ data: transaction })
    return created;
  }
};

export default new Transactions();