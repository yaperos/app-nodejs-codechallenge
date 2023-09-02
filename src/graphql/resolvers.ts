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
  },
  Mutation: {
    createTransaction: async (_: any, input: { data: Transaction.InputData }) => {
      return await TransactionServices.createTransaction({ input: input.data});
    }
  }
  
}