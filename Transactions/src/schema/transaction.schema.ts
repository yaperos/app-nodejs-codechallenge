export const typeDefs = `#graphql
type Transaction {
    transactionExternalId: ID!
    accountExternalIdDebit: String!
    accountExternalIdCredit: String!
    transactionType: String!
    transactionStatus: String!
    value: Float!
    createdAt: String!
}

type Query {
    getTransaction(transactionExternalId: ID!): Transaction
}

type Mutation {
    createTransaction(
        accountExternalIdDebit: String!,
        accountExternalIdCredit: String!,
        transactionType: String!,
        value: Float!
    ): Transaction
}`;
