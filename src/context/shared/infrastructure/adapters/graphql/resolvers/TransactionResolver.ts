export const transactionResolver = {
  Query: {
    getTransaction: async (_: any, { transactionExternalId }: { transactionExternalId: string }, { getTransactionByIdController }: any) => {
      return await getTransactionByIdController.run(transactionExternalId);
    },
  },
  Mutation: {
    createTransaction: async (_: any, { input }: { input: any }, { createTransactionController }: any) => {
      const transaction = await createTransactionController.run(input);
      return transaction.id;
    },
  },
};
