const { gql } = require('graphql')

const typeDefs = `
 type Transaction {
    id : ID!
    id_type: Int
    account_external_id_debit : String
    account_external_id_credit: String
    value: Float
    status: String
    create_at: String
    Transfer_type: [Transfer_type]
  }
 type Transfer_type {
    id: ID!
    description:String
  }
 type Query {
   getTransaction(id: ID!): Transaction
  }
 type Query {
    getTransfers: [Transfer_type]
  }

  type Mutation{
    createTransaction(id_type: Int,account_external_id_debit : String,account_external_id_credit: String,value: Float,status: String) : Transaction
  }


`

module.exports = typeDefs;
