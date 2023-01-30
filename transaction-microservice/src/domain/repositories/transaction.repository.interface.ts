import { TransactionModel } from "../model/transaction.model";

export interface ITransactionRepository{
    insert(transactionModel: TransactionModel): Promise<TransactionModel>;
    findByExternalId(externalId: string): Promise<TransactionModel>;
}