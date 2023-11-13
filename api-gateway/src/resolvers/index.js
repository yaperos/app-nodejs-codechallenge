const { createTransaction, getTransaction } = require('../services/transactionService');

const resolvers = {
  Query: {
    transaction: async (_, { id }) => {
      try {
        const transaction = await getTransaction(id);
        return transaction.data;
      } catch (error) {
        throw new Error(`Error al obtener la transacción: ${error.message}`);
      }
    },
  },
  Mutation: {
    createTransaction: async (_, { amount, tranferTypeId }) => {
      try {
        let newTransaction = await createTransaction({ amount, tranferTypeId });
        return newTransaction;
      } catch (error) {
        throw new Error(`Error al crear la transacción: ${error.message}`);
      }
    },
  },
};

module.exports = resolvers;
