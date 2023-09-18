import modelTransaction from "./transactions.model";
import HttpException from "../common/http-exception";
import {
  Transaction,
  CallbackPayload,
  TypeTransaction,
  BaseTransaction,
  StatusTransaction } from "./transactions.interface";
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

  const transactionCreated = await modelTransaction.createTransaction(transaction);

  // Sending petition to Anti-fraud service
  producerAntiFraud(transactionCreated);

  return transactionCreated;
};

export const fullTransaction = async(id: string) => {
  // Find the transaction in database
  const transaction = await modelTransaction.getTransaction(id);

  if (!transaction) throw new HttpException(404, "Transaction doesn't exists");

  // Find complementary information
  const [ type, status ] = await Promise.all([
    modelTransaction.getType(transaction.tranferTypeId),
    modelTransaction.getStatusTransaction(transaction.id),
  ])

  return {
    transactionExternalId: (transaction.accountExternalIdDebit || transaction.accountExternalIdCredit),
    transactionType: {
      name: type.name,
    },
    transactionStatus: {
      name: status?.name || 'pending',
    },
    value: transaction.value,
    createdAt: transaction.createdAt,
  };
};

export const processCallback = async(payload: CallbackPayload): Promise<StatusTransaction> => {
  const { id, name } = payload;
  const statusCreated = await modelTransaction.createStatus({
    name,
    transactionId: id,
  });

  return statusCreated;
}