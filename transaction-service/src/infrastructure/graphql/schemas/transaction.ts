// src/schema.ts
import { gql } from 'apollo-server-express';

export const typeDefs = gql`
  scalar Date
  
  input TransactionInput {
    accountExternalIdDebit: String!
    accountExternalIdCredit: String!
    transferTypeId: Int!
    value: Float!
  }

  type Transaction {
    transactionExternalId: ID!
    accountExternalIdDebit: String!
    accountExternalIdCredit: String!
    transactionStatus: TransactionStatus
    transactionType: TransactionType
    value: Float!
    createdAt: Date
  }
  
  type TransactionType {
    name: String!
  }

  type TransactionStatus {
    name: String!
  }

  type Query {
    getTransaction(id: ID!): Transaction
  }

  type Mutation {
    createTransaction(input: TransactionInput!): Transaction
  }
`;
