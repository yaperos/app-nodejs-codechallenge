export const typeDefs = `#graphql
  scalar JSON
  scalar UUID
  
  input TransactionInput {
    accountExternalIdDebit: UUID!
    accountExternalIdCredit: UUID!
    tranferTypeId: Int!
    value: Float!
  }

  type ResponseTransaction {
    messsage: String
    code: Int
    result: JSON
  }

  type Transaction {
    transactionExternalId: ID
    tranferTypeId: Int
    transactionStatus: String
    value: Int
    createAd: String
  }

  type Mutation {
    createTransaction(input: TransactionInput): ResponseTransaction
  }
  
  type Query {
    searchTransaction(transactionId: String!): Transaction
  }
`;
