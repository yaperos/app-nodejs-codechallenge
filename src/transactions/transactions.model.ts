import { StatusTransaction, Transaction, TypeTransaction } from "./transactions.interface";
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
  };
  async getStatusTransaction(id: string) {
    const found = await prisma.transactionStatus.findFirst({
      where: { transactionId: id },
      orderBy: { createdAt: 'desc' }
    });
    return found;
  };
  async createStatus(status: any): Promise<StatusTransaction> {
    const created = await prisma.transactionStatus.create({ data: status })
    return created;
  };
};

export default new Transactions();