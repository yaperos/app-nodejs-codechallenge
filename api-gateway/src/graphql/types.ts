export const typeDefs = `#graphql
  enum TransactionStatus {
    APPROVED
    REJECTED
    PENDING
  }

  input TransactionInput {
    accountExternalIdDebit: GUID!
    accountExternalIdCredit: GUID!
    tranferTypeId: PositiveInt!
    value: PositiveFloat!
  }

  type Response {
    message: String
    success: Boolean
    code: Int
  }

  type Transaction {
    transactionExternalId: ID
    tranferTypeId: Int
    status: TransactionStatus
    value: Float
    createdAt: DateTime
  }

  type ResponseTransaction {
    message: String
    success: Boolean
    code: Int
    result: Transaction
  }

  type Mutation {
    createTransaction(input: TransactionInput): Response
  }
  
  type Query {
    searchTransaction(transactionId: GUID!): ResponseTransaction!
    allTransaction: [Transaction]!
  }
`;
