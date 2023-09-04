import resolvers from "./resolvers";

const typeDefs = `#graphql

  type Transaction {
    id: ID!
    accountExternalIdCredit: String!
    accountExternalIdDebit: String!
    transferTypeId: Int!
    transferType: String!
    value: Float!
    status: TransactionStatus
    createdAt: String
    updatedAt: String
  }

  enum TransactionStatus {
    pending
    approved
    rejected
  }

  input TransactionInput {
    accountExternalIdCredit: String!
    accountExternalIdDebit: String!
    transferTypeId: Int!
    value: Float!
  }

  # QUERIES
  type Query {
    transaction(id: String!): Transaction
    transactions: [Transaction]
    transactionsByIds(ids: [String]!): [Transaction]
  }

  # MUTATIONS
  type Mutation {
    createTransaction(data: TransactionInput!): Transaction
    batchCreateTransactions(data: [TransactionInput!]!): [Transaction]
  }

`

export {
  resolvers,
  typeDefs,
};