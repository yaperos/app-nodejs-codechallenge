import { PrismaClient } from "@prisma/client";

import { TransactionExternal } from "../../domain";
import { ITransactionRepo } from "../transactionRepo";
import { TransactionMap } from "../../mappers";

export class PrismaTransactionRepo implements ITransactionRepo {
  private prisma;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async exists(transactionId: string): Promise<boolean> {
    const result = await this.prisma.transaction.findFirst({
      where: { id: transactionId },
    });
    return !!result;
  }

  async save(transaction: TransactionExternal): Promise<void> {
    const transactionToPersitence = await TransactionMap.toPersistance(
      transaction
    );
    await this.prisma.transaction.create({ data: transactionToPersitence });
  }

  async getTransactionById(
    transactionId: string
  ): Promise<TransactionExternal> {
    const result = await this.prisma.transaction.findUnique({
      where: { id: transactionId },
    });

    return TransactionMap.toDomain(result);
  }

  async update(transaction: TransactionExternal): Promise<void> {
    const transactionToPersitence = await TransactionMap.toPersistance(
      transaction
    );
    await this.prisma.transaction.update({
      where: { id: transactionToPersitence.id },
      data: transactionToPersitence,
    });
  }
}
