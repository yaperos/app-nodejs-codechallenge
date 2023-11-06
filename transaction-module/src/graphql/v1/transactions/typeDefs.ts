export const typeDefinitions = `#graphql
  type Transaction {
    transaction_id: ID!,
    accountExternalIdDebit: String,
    accountExternalIdCredit: String,
    transferTypeId: String,
    value: Float,
    transaction_status_id: String,
    createdAt: String,
    updatedAt: String,
  }

  type Query {
    transactions: [Transaction]
  }
`
