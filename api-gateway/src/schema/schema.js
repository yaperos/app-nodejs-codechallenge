const { makeExecutableSchema } = require('apollo-server-express');
const typeDefs = require('./schema/index');
const resolvers = require('./schema/resolvers');

// Combine typeDefs and resolvers to create a schema
const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

module.exports = schema;
