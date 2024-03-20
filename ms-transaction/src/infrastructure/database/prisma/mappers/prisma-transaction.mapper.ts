import { Transaction as PrismaTransaction } from '@prisma/client';
import { TransactionEntity } from '../../../../domain/entities/transaction.entity';
import type {
  TransferStatus,
  TransferType,
} from '../../../../domain/interfaces/transaction.interface';
export class PrismaTransactionMapper {
  private constructor() {
    throw new Error(
      'PrismaTransactionnMapper is a static class and should not be instantiated',
    );
  }

  public static toPrisma(transaction: TransactionEntity): PrismaTransaction {
    return {
      id: transaction.id,
      externalId: transaction.externalId,
      amount: transaction.amount,
      accountExternalName: transaction.accountExternalName,
      transferTypeName: transaction.transferTypeName,
      status: transaction.status,
      createdAt: transaction.createdAt,
      updatedAt: transaction.updatedAt,
    };
  }

  public static toDomain(transactionPrismaData: PrismaTransaction) {
    return new TransactionEntity(
      {
        amount: transactionPrismaData.amount,
        externalId: transactionPrismaData.externalId,
        accountExternalName: transactionPrismaData.accountExternalName,
        transferTypeName:
          transactionPrismaData.transferTypeName as TransferType,
        status: transactionPrismaData.status as TransferStatus,
        createdAt: transactionPrismaData.createdAt,
        updatedAt: transactionPrismaData.updatedAt,
      },
      transactionPrismaData.id,
    );
  }
}
