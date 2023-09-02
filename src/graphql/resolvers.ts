import TransactionServices from "../services/transaction_services";
import Transaction from "src/models/Transaction";

export default {
  Query: {
    transaction: async (_: any, input: { id: string }) => {
      return await TransactionServices.getTransactionById(input.id);
    },
    transactions: async () => {
      return await TransactionServices.getAllTransactions();
    },
    transactionsByIds: async (_: any, input: { ids: string[] }) => {
      return await TransactionServices.getTransactionsByIds({ transactionIds: input.ids} );
    }
  },
  Mutation: {
    createTransaction: async (_: any, input: { data: Transaction.InputData }) => {
      return await TransactionServices.createTransaction({ input: input.data});
    },
    batchCreateTransactions: async (_: any, input: { data: Transaction.InputData[] }) => {
      return await TransactionServices.batchCreateTransactions({ input: input.data })
    }
  }
  
}