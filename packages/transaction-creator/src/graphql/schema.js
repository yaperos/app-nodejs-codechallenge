const { GraphQLObjectType, GraphQLSchema, GraphQLString, GraphQLList, GraphQLInt, GraphQLFloat } = require("graphql");
const TransactionType = require("../models/transaction");
const TransactionStatusType = require("../models/transactionStatus");
const TransactionTypesType = require("../models/transactionTypes");
const TransactionStatusRepository = require("../repositories/transactionStatusRepository");
const TransactionTypeRepository = require("../repositories/transactionTypeRepository");
const TransactionsRepository = require("../repositories/transactionsRepository");
const pool = require("../config/database");

const transactionStatusRepository = new TransactionStatusRepository(pool);
const transactionTypeRepository = new TransactionTypeRepository(pool);
const transactionsRepository = new TransactionsRepository(pool);

const RootQueryType = new GraphQLObjectType({
  name: "Query",
  fields: {
    getTransactionStatus: {
      type: new GraphQLList(TransactionStatusType),
      resolve: async () => {
        return await transactionStatusRepository.getTransactionStatus();
      },
    },
    getTransactionTypes: {
      type: new GraphQLList(TransactionTypesType),
      resolve: async () => {
        return await transactionTypeRepository.getTransactionTypes();
      },
    },
    getTransactions: {
      type: new GraphQLList(TransactionType),
      resolve: async () => {
        return await transactionsRepository.getTransactions();
      },
    },
  },
});

const RootMutationType = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    createTransactionStatus: {
      type: TransactionStatusType,
      args: {
        id: { type: GraphQLInt },
        name: { type: GraphQLString },
      },
      resolve: async (_, args) => {
        const { id, name } = args;
        return await transactionStatusRepository.createTransactionStatus(id, name);
      },
    },
    createTransactionType: {
      type: TransactionTypesType,
      args: {
        id: { type: GraphQLInt },
        name: { type: GraphQLString },
      },
      resolve: async (_, args) => {
        const { id, name } = args;
        return await transactionTypeRepository.createTransactionType(id, name);
      },
    },
    createTransaction: {
      type: TransactionType,
      args: {
        transferTypeId: { type: GraphQLInt },
        value: { type: GraphQLFloat },
        accountExternalIdDebit: { type: GraphQLString },
        accountExternalIdCredit: { type: GraphQLString },
      },
      resolve: async (_, args) => {
        const { accountExternalIdDebit, accountExternalIdCredit, transferTypeId, value } = args;
        const result = await transactionsRepository.createTransaction(transferTypeId, value, accountExternalIdDebit, accountExternalIdCredit);
        return result;
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQueryType,
  mutation: RootMutationType,
});
