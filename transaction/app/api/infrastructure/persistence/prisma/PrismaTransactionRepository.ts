import { PrismaClient, Transaction } from "@prisma/client";
import { ISearchTransaction } from "../../../domain/transaction/objects/IsearchTransaction";
import { ITransactionRepository } from "../../../domain/transaction/ItransactionRepository";
import { ITransactionPersistence } from "../../../domain/transaction/objects/ITransactionPersistence";

export class PrismaTransactionRepository implements ITransactionRepository {
  constructor(private db: PrismaClient) {}
  public async updateTransaction(
    transaction: ITransactionPersistence
  ): Promise<void> {
    const { id, ...rest } = transaction;
    await this.db.transaction.update({
      where: {
        id: id,
      },
      data: {
        ...rest,
      },
    });
  }

  public async create(transaction: ITransactionPersistence): Promise<any> {
    return await this.db.transaction.create({
      data: {
        ...transaction,
        // accountExternalIdCredit: transaction.accountExternalIdCredit,
        // accountExternalIdDebit: transaction.accountExternalIdDebit,
        // status: transaction.status,
        // tranferTypeId: transaction.tranferTypeId,
        // value: transaction.value,
      },
    });
  }
  public async getTransaction(
    transaction: ISearchTransaction
  ): Promise<ITransactionPersistence | any> {
    return await this.db.transaction.findUnique({
      where: {
        id: transaction.transactionExternalId,
        value: transaction.value,
        status: transaction.transactionStatus.name,
      },
    });
  }
}
