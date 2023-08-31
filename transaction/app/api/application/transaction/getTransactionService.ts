import { ITransactionPersistence } from "../../domain/transaction/objects/ITransactionPersistence";
import { ISearchTransaction } from "../../domain/transaction/objects/IsearchTransaction";
import { PrismaTransactionRepository } from "../../infrastructure/persistence/prisma/PrismaTransactionRepository";

export class GetTransactionService {
  constructor(private transactionRepository: PrismaTransactionRepository) {}

  public async invoke(
    transaction: ISearchTransaction
  ): Promise<ITransactionPersistence | any> {
    return await this.transactionRepository.getTransaction(transaction);
  }
}
