import express from "express";
import compression from "compression";
import cors from "cors";
import { createServer } from "http";
import { ApolloServer } from "apollo-server-express";
import schema from './modules/transaction/graphql/schema'
import expressPlayGround from "graphql-playground-middleware-express";
import { AppDataSource } from "./db";

const app = express();

app.use("*", cors());
app.use(compression());

async function startServer() {
  const server = new ApolloServer({
    schema,
    introspection: true,
  });

  await server.start();
  console.log("connecting to db...")
  await AppDataSource.initialize()
  console.log("Connection successfully!")
  server.applyMiddleware({ app });
}

startServer();

app.get("/", expressPlayGround({ endpoint: "/graphql" }));

const httpServer = createServer(app);

httpServer.listen({ port: 3000 }, () => {
  console.log("Running in: http://localhost:3000");
});