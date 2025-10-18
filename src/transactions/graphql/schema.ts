export const typeDefs = /* GraphQL */ `
  type TransactionType {
    name: String!
  }

  type TransactionStatus {
    name: String!
  }

  type Transaction {
    transactionExternalId: ID!
    transactionType: TransactionType!
    transactionStatus: TransactionStatus!
    value: Float!
    createdAt: String!
  }

  input CreateTransactionInput {
    accountExternalIdDebit: ID!
    accountExternalIdCredit: ID!
    transferTypeId: Int!
    value: Float!
  }

  type Query {
    transaction(transactionExternalId: ID!): Transaction
    transactions: [Transaction!]!
  }

  type Mutation {
    createTransaction(input: CreateTransactionInput!): Transaction!
  }
`;
