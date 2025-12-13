import { TransactionService } from '../services/TransactionService';

const transactionService = new TransactionService();

// Resolvers de GraphQL para transacciones: define la lógica de las queries y mutations.
export const resolvers = {

  // Query resolvers
  Query: {
    getTransaction: async (_: any, { transactionExternalId }: { transactionExternalId: string }) => {
      return await transactionService.getTransactionById(transactionExternalId);
    },
  },
  
  // Mutation resolvers
  Mutation: {
    createTransaction: async (_: any, { input }: any) => {
    const transaction = await transactionService.createTransaction(input);
    return { transactionExternalId: transaction.transactionExternalId };
    },
  },
};
