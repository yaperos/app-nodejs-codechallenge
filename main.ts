import { Model } from 'objection';
import knexConfig from "./knexfile";
import Knex from "knex";
import dotenv from "dotenv";
import { kafkaConsumer } from "./src/events";
import { resolvers, typeDefs } from "./src/graphql";
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';

dotenv.config();

async function app() {
  const app = new ApolloServer({
    typeDefs,
    resolvers,
  });

  const { url } = await startStandaloneServer(app, {
    listen: { port: 4000 },
  });

  console.log(`🚀  Server ready at: ${url}`);

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