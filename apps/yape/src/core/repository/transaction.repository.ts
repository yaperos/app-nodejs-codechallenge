import { UpdateResult } from "typeorm";
import { TransactionEntity } from "../entity/transaction.entity";

export interface TransactionRepository {
  insert(transactionEntity: TransactionEntity): Promise<TransactionEntity>;
  update(transactionEntity: TransactionEntity): Promise<UpdateResult>;
  get(transactionId: string): Promise<TransactionEntity>;
}