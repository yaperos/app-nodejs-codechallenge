import { Transaction } from "@prisma/client";
import { ITransactionPersistence } from "./objects/ITransactionPersistence";
import { ISearchTransaction } from "./objects/IsearchTransaction";

export interface ITransactionRepository {
  create(transaction: ITransactionPersistence): Promise<void>;
  getTransaction(transaction: ISearchTransaction): Promise<Transaction>;
  updateTransaction(transaction: ITransactionPersistence): Promise<void>;
}
