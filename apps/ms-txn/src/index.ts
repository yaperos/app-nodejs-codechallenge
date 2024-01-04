import "reflect-metadata"
import "dotenv/config"
import assert from "assert"
import compression from "compression"
import cors from "cors"
import express, { Express, NextFunction, Request, Response } from "express"
import { graphqlHTTP } from "express-graphql"
import { buildSchema } from "type-graphql"
import { Container } from "typedi"
import { createCommonLogger, createRequestLogger } from "@common-txn/logger"
import { KafkaProducerService } from "@common-txn/service"
import { TxnResolver } from "./graphql/resolvers"
import { txnDataSource } from "./datasource"

const logger = createCommonLogger(process.stdout)

async function main() {
  assert.ok(process.env.PORT, "Undefined port")
  const port = process.env.PORT

  assert.ok(process.env.KAFKA_BROKERS, "Undefined kafka brokers")
  const kafkaBrokers = process.env.KAFKA_BROKERS.split(",")

  assert.ok(process.env.TOPIC_VALIDATE_TXN, "Undefined kafka topic")
  const kafkaTopic = process.env.TOPIC_VALIDATE_TXN

  const validateTxnProducer = new KafkaProducerService(
    kafkaTopic,
    kafkaBrokers
  )

  await validateTxnProducer.createTopic()
  Container.set("validateTxnProducer", validateTxnProducer)
  Container.set("txnManager", txnDataSource.manager)

  const app: Express = express()

  app.use(compression())
  app.use(cors())
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))

  const reqLogger = createRequestLogger(process.stdout)

  app.use((req: Request, res: Response, next: NextFunction) => {
    reqLogger.info({ req, res })
    next()
  })

  app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    reqLogger.error({ req, res, err })
    next(err)
  })

  const schema = await buildSchema({
    resolvers: [TxnResolver],
    validate: false,
    container: Container,
    emitSchemaFile: false,
  })

  app.use("/graphql", graphqlHTTP({ schema, graphiql: true }))

  app.get("/", (req: Request, res: Response) => {
    res.send("Express + TypeScript Server")
  })

  const server = app.listen(port, () => {
    logger.info(`[server]: Server is running at http://localhost:${port}`)
    process.send && process.send("ready")
  })

  for(const signal of ["SIGINT", "SIGTERM"]) {
    process.on(signal, () => {
      logger.info(`${signal} signal received: closing HTTP server`)
      server.close(() => logger.info('HTTP server closed'))
    })
  }
}

txnDataSource
  .initialize()
    .then(() => {
        logger.info("Data Source has been initialized!")
    })
    .catch((err) => {
        logger.error("Error during Data Source initialization:", err)
    })

main()
  .catch((err: Error) => logger.error(err.stack || err.message))