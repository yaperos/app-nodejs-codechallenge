import "reflect-metadata";
import "dotenv/config";
import assert from "assert";
import compression from "compression"
import cors from "cors";
import express, { Express, Request, Response } from "express";
import { graphqlHTTP } from "express-graphql";
import { buildSchema } from "type-graphql";
import { Container } from "typedi";
import { KafkaProducerService } from "@common-txn/di";

import { TxnResolver } from "./graphql/resolvers"

async function main() {
  assert.ok(process.env.PORT, "Undefined port");
  const port = process.env.PORT;

  assert.ok(process.env.KAFKA_BROKERS, "Undefined kafka brokers");
  const kafkaBrokers = process.env.KAFKA_BROKERS.split(",");

  assert.ok(process.env.TOPIC_CREATE_TXN, "Undefined kafka topic");
  const kafkaTopic = process.env.TOPIC_CREATE_TXN;

  const createTXNProducer = new KafkaProducerService(
    "create-txn-producer-client",
    kafkaBrokers,
    kafkaTopic
  );

  const created = await createTXNProducer.createTopic();
  if(created) {
    console.info("Topic created: ", kafkaTopic)
  }
  Container.set("CreateTXNProducer", createTXNProducer)

  const app: Express = express();

  app.use(compression())
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  const schema = await buildSchema({
    resolvers: [TxnResolver],
    validate: false,
    container: Container,
    emitSchemaFile: false,
  })

  app.use("/graphql", graphqlHTTP({ schema, graphiql: true }));

  app.get("/", (req: Request, res: Response) => {
    res.send("Express + TypeScript Server");
  });

  const server = app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
  });

  process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');

    server.close(() => console.log('HTTP server closed'));
  })
}

main()
  .catch((err: Error) => console.error(err.stack || err.message))