import modelTransaction from "./transactions.model";
import { Transaction, TypeTransaction, BaseTransaction } from "./transactions.interface";

/**
 * Service methods
 */
export const findTransaction = async(id: string): Promise<Transaction> => modelTransaction.getTransaction(id);

export const findType = async(id: number): Promise<TypeTransaction> => modelTransaction.getType(id);

export const createTransaction = async(transaction: BaseTransaction): Promise<Transaction> => {
  // Validating value column
  const { tranferTypeId = 0, value = 0 } = transaction;
  if (value > 1000 || value <= 0) throw new Error("Value must be between 1 and 1000");

  // Validating if transaction type exists
  const type = await findType(tranferTypeId);
  if (!type) throw new Error("Transaction type doesn't exists");

  return modelTransaction.createTransaction(transaction);
}
