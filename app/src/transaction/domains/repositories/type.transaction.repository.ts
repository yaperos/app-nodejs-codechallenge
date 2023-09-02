import { TypeTransactionModel } from "../model/type.transaction.model";

export interface ITypeTransactionRepository{
    getOne(id:number): Promise<TypeTransactionModel>
}
