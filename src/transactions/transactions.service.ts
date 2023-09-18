import modelTransaction from "./transactions.model";
import HttpException from "../common/http-exception";
import { Transaction, TypeTransaction, BaseTransaction } from "./transactions.interface";
import { producerAntiFraud } from "../common/anti-fraud.service";

/**
 * Service methods
 */
export const findTransaction = async(id: string): Promise<Transaction> => modelTransaction.getTransaction(id);

export const findType = async(id: number): Promise<TypeTransaction> => modelTransaction.getType(id);

export const createTransaction = async(transaction: BaseTransaction): Promise<Transaction> => {
  // Validating value column
  const { tranferTypeId = 0, value = 0 } = transaction;
  if (value > 1000 || value <= 0) throw new HttpException(400, "Value must be between 1 and 1000" );

  // Validating if transaction type exists
  const type = await findType(tranferTypeId);
  if (!type) throw new HttpException(400, "Transaction type doesn't exists");

  const transactionCreated = modelTransaction.createTransaction(transaction);

  // Sending petition to Anti-fraud service
  producerAntiFraud(transaction);

  return transactionCreated;
}
