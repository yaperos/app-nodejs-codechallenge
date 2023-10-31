import gql from 'graphql-tag';

export const typeDefs = gql`
  scalar DateTime

  input CreateTransactionUseCaseInput {
    accountExternalIdDebit: String!
    accountExternalIdCredit: String!
    tranferTypeId: Int!
    value: Float!
  }

  type TransactionOutput {
    transactionExternalId: String!
    transactionType: TransactionTypeOutput!
    transactionStatus: TransactionStatusOutput!
    value: Float!
    createdAt: DateTime!
  }

  type TransactionTypeOutput {
    name: String!
  }

  type TransactionStatusOutput {
    name: String!
  }

  type Query {
    retrieveTransaction(externalId: String!): TransactionOutput!
  }

  type Mutation {
    createTransaction(input: CreateTransactionUseCaseInput!): TransactionOutput!
  }
`;
