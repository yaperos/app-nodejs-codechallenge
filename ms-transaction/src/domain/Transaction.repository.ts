import { TransactionEntity } from "./Transaction.entity";

export interface TransactionRepository{
    registerTrx(trx:TransactionEntity):Promise<TransactionEntity>;
    findTrx(id:number):Promise<TransactionEntity|null>;
}