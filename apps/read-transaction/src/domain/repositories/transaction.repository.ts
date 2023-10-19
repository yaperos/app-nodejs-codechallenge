import { CreateTransactionDto } from "../../infraestructure/dto/create-transaction.dto";
import { TransactionStatus } from "../enums/transaction-status.enum";
import { TransactionModel } from "../models/transaction.model";

export interface TransactionRepository {
  save(transaction: CreateTransactionDto): Promise<TransactionModel>;
  updateStatus(id: string, status: TransactionStatus): Promise<void>;
  findOne(id: string): Promise<TransactionModel>;
}

export const TransactionTypeOrmRepository = Symbol('TransactionRepository');
export const TransactionMongooseRepository = Symbol('TransactionRepository');