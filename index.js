const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const typeDefs = require('./src/graphql/typeDefs');
const resolvers =require('./src/graphql/resolvers')


const app = express();

const server = new ApolloServer({ typeDefs,resolvers });


async function start() {
  await server.start()
  server.applyMiddleware({ app });
}

start()
 
app.listen(4000, () =>
  console.log(`Servidor GraphQL listo en http://localhost:4000${server.graphqlPath}`)
);