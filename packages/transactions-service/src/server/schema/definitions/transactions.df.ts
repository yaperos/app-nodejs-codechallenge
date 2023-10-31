import { gql } from 'apollo-server'
import { type DocumentNode } from 'graphql'

const TransactionTypeDef: DocumentNode = gql`
   type TransactionType {
    name: String
  }
  
  type TransactionStatus {
    name: String
  }

  type Transaction {
    transactionExternalId: String
    transactionType: TransactionType
    transactionStatus: TransactionStatus
    value: Float
    createdAt: String
  }

  input TransactionCreation {
    accountExternalIdDebit: String
    accountExternalIdCredit: String
    transferTypeId: Int!
    value: Float!
  }

  type Query {
    transactions: [Transaction] 
    transactionByExternalId(transactionExternalId: String!): Transaction
  }
  type Mutation {
    transaction(transaction: TransactionCreation!): Transaction
  }
`

export default TransactionTypeDef
