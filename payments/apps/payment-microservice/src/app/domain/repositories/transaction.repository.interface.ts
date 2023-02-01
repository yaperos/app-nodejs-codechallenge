import { TransactionModel } from "@payments/shared/model";

export interface ITransactionRepository{
    insert(transactionModel: TransactionModel): Promise<TransactionModel>;
    update(transactionModel: TransactionModel): Promise<TransactionModel>;
    findByExternalId(externalId: string): Promise<TransactionModel>;
}