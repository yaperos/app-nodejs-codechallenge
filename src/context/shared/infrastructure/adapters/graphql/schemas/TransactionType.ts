import { gql } from 'apollo-server-express';

export const typeDefs = gql`
  type Transaction {
    id: String
    accountExternalIdDebit: String!
    accountExternalIdCredit: String!
    transactionExternalId: String
    transactionType: String
    transferTypeId: Int!
    value: Float!
    status: String!
    createdAt: String!
    updatedAt: String
  }

  input CreateTransactionInput {
    accountExternalIdDebit: String!
    accountExternalIdCredit: String!
    transferTypeId: Int!
    value: Float!
  }

  type Query {
    getTransaction(transactionExternalId: String!): Transaction
  }

  type Mutation {
    createTransaction(input: CreateTransactionInput): String
  }
`;
