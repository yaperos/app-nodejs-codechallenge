import { CreateTransactionInput } from "../infraestructure/dto/create-transaction.input";
import { TransactionStatus } from "./enums/transaction-status.enum";
import { TransactionModel } from "./transaction.model";

export interface TransactionRepository {
  save(transaction: CreateTransactionInput): Promise<TransactionModel>;
  updateStatus(id: string, status: TransactionStatus): Promise<void>;
  findOne(id: string): Promise<TransactionModel>;
}

export const TransactionRepository = Symbol('TransactionRepository');