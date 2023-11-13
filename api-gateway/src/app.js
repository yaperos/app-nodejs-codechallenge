const express = require('express');
const cors = require('cors')
const { ApolloServer } = require('apollo-server-express');
const typeDefs = require('./schema');
const resolvers = require('./resolvers');

async function createServer() {
  const app = express();
  app.use(cors());
  const server = new ApolloServer({ typeDefs, resolvers });

  await server.start();
  server.applyMiddleware({ app });

  return app;
}

module.exports = createServer;
