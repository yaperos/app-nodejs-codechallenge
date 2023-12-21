const { buildSchema } = require("graphql");

const schema = buildSchema(`
  scalar DateTime

  input TransactionInput {
    accountExternalIdDebit: ID
    accountExternalIdCredit: ID
    transferTypeId: Int!
  }

  enum TransactionTypeName {
    ALPHA
    BETHA
  }

  enum StatusType {
    pending
    approved
    rejected
  }

  type Transaction {
    id: ID
    accountExternalIdDebit: ID
    accountExternalIdCredit: ID
    transferTypeId: Int
    value: Int
    status: String
    createdAt: DateTime
  }

  input NameStatusInput {
    name: StatusType!
  }

  input TransactionTypeNameInput {
    name: TransactionTypeName!
  }

  input TransactionFiltersInput {
    transactionExternalId: ID
    transactionType: TransactionTypeNameInput
    transactionStatus: NameStatusInput
    value: Int
    createdAt: DateTime
  }

  type Query {
    listTransactions(input: TransactionFiltersInput): [Transaction]
  }

  type Mutation {
    createTransaction(input: TransactionInput): Transaction
  }
  
`);

module.exports = {
  schema,
};
