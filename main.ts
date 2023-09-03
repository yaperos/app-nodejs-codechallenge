import { Model } from 'objection';
import knexConfig from './knexfile';
import Knex from 'knex';
import dotenv from 'dotenv';
import { kafkaConsumer } from './src/events';
import { resolvers, typeDefs } from './src/graphql';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import express from 'express';
import cors from 'cors';
import http from 'http';
import { json } from 'body-parser';

dotenv.config();

async function app() {
  const app = express();
  const httpServer = http.createServer(app);
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });

  await server.start()

  app.use(
    '/graphql',
    cors<cors.CorsRequest>({ origin: ['https://www.your-app.example', 'https://studio.apollographql.com'] }),
    json(),
    expressMiddleware(server),
  );
  
  await new Promise<void>((resolve) => httpServer.listen({ port: 4000 }, resolve));
  console.log(`🚀 Server ready at http://localhost:4000/graphql`);

  // Initialize DB connection
  // @ts-ignore
  const env = process.env.NODE_ENV === "production" ? "production" : "development";
  const knex = Knex(knexConfig[env]);
  Model.knex(knex);

}

// Set up Kafka Consumer
try {
  app();
  kafkaConsumer();
} catch {
  throw new Error("Error setting up server")
}