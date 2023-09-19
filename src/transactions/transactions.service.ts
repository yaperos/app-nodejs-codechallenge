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
 * Find a transaction
 * @param {string} id - Transaction identifier
 * @returns {Transaction} - Transaction object
 */
export const findTransaction = async(id: string): Promise<Transaction> => modelTransaction.getTransaction(id);

/**
 * Find a type of transaction (Debit, Credit, Refund)
 * @param {number} id - Type of transaction identifier
 * @returns {TypeTransaction} - Type of transaction object
 */
export const findType = async(id: number): Promise<TypeTransaction> => modelTransaction.getType(id);

/**
 * Create a transaction with minimal parameters
 * @param {BaseTransaction} transaction - Transaction to create
 * @param {string} transaction.accountExternalIdDebit - GUUID for an external debit
 * @param {string} transaction.accountExternalIdCredit - GUUID for an external credit
 * @param {number} transaction.tranferTypeId - Type of transactionidentifier
 * @param {number} transaction.value - Amount of transaction
 * @returns {Transaction} - Transaction object created 
 */
export const createTransaction = async(transaction: BaseTransaction): Promise<Transaction> => {
  // Validating external identifier
  const {accountExternalIdDebit, accountExternalIdCredit} = transaction;
  if (!accountExternalIdDebit && !accountExternalIdCredit) 
    throw new HttpException(400, "External identifier not found" );

  // Validating value column
  const { tranferTypeId = 0, value = 0 } = transaction;
  if (value <= 0) throw new HttpException(400, "Value must be greater or equal to 1" );

  // Validating if transaction type exists
  const type = await findType(tranferTypeId);
  if (!type) throw new HttpException(400, "Transaction type doesn't exists");

  // Creating the transaction document
  const transactionCreated = await modelTransaction.createTransaction(transaction);

  // Creating a initial status of transaction
  modelTransaction.createStatus({
    name: (value > 1000) ? 'rejected' : 'pending',
    transactionId: transactionCreated.id,
  });

  // Sending transaction to Anti-fraud service
  if (value <= 1000) producerAntiFraud(transactionCreated);

  return transactionCreated;
};

/**
 * Retrieve a full transaction (aggregation with type and status)
 * @param {string} id - Transaction identifier
 * @returns {Object} - All information relative to transaction
 */
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

/**
 * Method to process response from Anti-fraud service
 * @param {CallbackPayload} payload - Response sent by Anti-fraud service
 * @param {string} payload.id - Transaction identifier
 * @param {string} payload.name - Enum value of status transaction: approved, rejected
 * @returns {StatusTransaction} - Status document created
 */
export const processCallback = async(payload: CallbackPayload): Promise<StatusTransaction> => {
  const { id, name } = payload;
  const statusCreated = await modelTransaction.createStatus({
    name,
    transactionId: id,
  });

  return statusCreated;
};