import { ITransaction, ITransactionBody } from "./Transaction";

export interface ITransactionRepository {
  getById(transactionExternalId: string): Promise<ITransaction>;
  createTransaction(iTransactionBody: ITransactionBody): Promise<ITransaction>;
}
