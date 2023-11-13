const { gql } = require('apollo-server-express');

const typeDefs = gql`
  # Tipos
  type Transaction {
    id: ID
    amount: Float
    description: String
    transactionStatus: String
    accountExternalIdDebit: ID
    accountExternalIdCredit: ID
    tranferTypeId : Float
    createdAt: String
    updatedAt: String
  }

  # The root provides a resolver function for each API endpoint
  type Query {
    transaction(id: ID): Transaction
    transactions: [Transaction]
  }

  type Mutation {
    createTransaction(amount: Float!, tranferTypeId:Float): Transaction
  }
`;

module.exports = typeDefs;
