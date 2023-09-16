import modelTransaction from "./transactions.model";
import { Transaction, TypeTransaction, BaseTransaction } from "./transactions.interface";

/**
 * Service methods
 */
export const findTransaction = async(id: string): Promise<Transaction> => modelTransaction.getTransaction(id);

export const findType = async(id: number): Promise<TypeTransaction> => modelTransaction.getType(id);

export const createTransaction = async(transaction: BaseTransaction): Promise<Transaction> => modelTransaction.createTransaction(transaction);
