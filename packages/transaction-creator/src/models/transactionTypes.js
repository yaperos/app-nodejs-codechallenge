const { GraphQLObjectType, GraphQLString, GraphQLInt } = require("graphql");

const TransactionTypesType = new GraphQLObjectType({
  name: "TransactionTypes",
  fields: () => ({
    id: { type: GraphQLInt },
    name: { type: GraphQLString },
  }),
});

module.exports = TransactionTypesType;
