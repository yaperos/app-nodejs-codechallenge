const { GraphQLObjectType, GraphQLString, GraphQLInt } = require("graphql");

const TransactionStatusType = new GraphQLObjectType({
  name: "TransactionStatus",
  fields: () => ({
    id: { type: GraphQLInt },
    name: { type: GraphQLString },
  }),
});

module.exports = TransactionStatusType;
