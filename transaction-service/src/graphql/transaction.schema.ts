import { gql } from 'apollo-server-express';

export const typeDefs = gql`
  type TransactionType {
    name: String!
  }

  type TransactionStatus {
    name: String!
  }

  type Transaction {
    transactionExternalId: String!
    transactionType: TransactionType!
    transactionStatus: TransactionStatus!
    value: Float!
    createdAt: String!
  }

  type Query {
    getTransaction(transactionExternalId: String!): Transaction
  }

  input CreateTransactionInput {
    accountExternalIdDebit: String!
    accountExternalIdCredit: String!
    transferTypeId: Int!
    value: Float!
  }

  type TransactionCreated {
    transactionExternalId: String!
  }

  type Mutation {
    createTransaction(input: CreateTransactionInput!): TransactionCreated!
  }
`;
