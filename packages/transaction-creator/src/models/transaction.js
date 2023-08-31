const { GraphQLObjectType, GraphQLString, GraphQLInt } = require("graphql");
const TransactionStatusType = require("./transactionStatus");
const TransactionTypesType = require("./transactionTypes");
const pool = require("../config/database");

const TransactionType = new GraphQLObjectType({
  name: "Transactions",
  fields: () => ({
    id: { type: GraphQLInt },
    transactionType: {
      type: TransactionTypesType,
      resolve: async (parent) => {
        const query = "SELECT * FROM transactionTypes WHERE id=$1";
        const values = [parent.transaction_type];
        const result = await pool.query(query, values);
        return result.rows[0];
      },
    },
    transactionExternalId: { type: GraphQLString },
    transactionStatus: {
      type: TransactionStatusType,
      resolve: async (parent) => {
        const query = "SELECT * FROM transactionStatus WHERE id=$1";
        const values = [parent.transaction_status];
        const result = await pool.query(query, values);
        return result.rows[0];
      },
    },
    value: { type: GraphQLInt },
    createdAt: { type: GraphQLString },
  }),
});

module.exports = TransactionType;
