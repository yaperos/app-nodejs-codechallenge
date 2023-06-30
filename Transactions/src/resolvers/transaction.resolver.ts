import { DataSource } from 'typeorm';
import { createTransaction, getTransaction } from '../controllers/transaction.controller.js';
import { sendTransactionCreatedEvent } from '../kafka/producer.js';

export const transactionResolvers = {
  Query: {
    getTransaction: (_: any, { transactionExternalId }: { transactionExternalId: string }, { dataSource }: { dataSource: DataSource }) => getTransaction(transactionExternalId, dataSource),
  },
  Mutation: {
    createTransaction: async (_: any, transactionData: any, { dataSource }: { dataSource: DataSource }) => {
      const transaction = await createTransaction(transactionData, dataSource);
      await sendTransactionCreatedEvent(transaction);
      return transaction;
    },
  },
};
