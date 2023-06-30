import { DataSource } from 'typeorm';
import { Transaction } from '../models/transaction.model.js';
import { dataSource as dbConnection } from '../app.js';

export const createTransaction = async (transactionData: any, dataSource: DataSource) => {
  const transactionRepository = dbConnection.getRepository(Transaction);

  const transaction = new Transaction();
  transaction.accountExternalIdDebit = transactionData.accountExternalIdDebit;
  transaction.accountExternalIdCredit = transactionData.accountExternalIdCredit;
  transaction.transactionType = transactionData.transactionType;
  transaction.value = transactionData.value;
  transaction.transactionStatus = 'pending';

  await transactionRepository.save(transaction);

  return transaction;
};

export const getTransaction = async (transactionExternalId: string, dataSource: DataSource) => {
  const transactionRepository = dbConnection.getRepository(Transaction);
  return await transactionRepository.findOne({ where: { transactionExternalId } });
};

export const updateTransactionStatus = async (transaction: Transaction, status: string, dataSource: DataSource) => {
  const transactionRepository = dbConnection.getRepository(Transaction);
  transaction.transactionStatus = status;
  await transactionRepository.save(transaction);
};
