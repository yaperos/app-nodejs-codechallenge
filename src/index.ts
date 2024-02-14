import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import {ApolloServer} from "@apollo/server"
import {expressMiddleware} from "@apollo/server/express4"
import {typeDefs, resolvers} from "./graphql"
import morganMiddleware from "./lib/morgan/morgan-middleware"
import baseRouter from './routes/index';
import Logger from "./lib/log/logger"
import { consumer } from './lib/kafka/consumer'
dotenv.config()
const app = express()
const port = process.env.PORT || 4000

const bootstrapServer = async () => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  })
  await server.start()

  app.use(cors())
  app.disable('x-powered-by')
  app.use(express.json())
  app.use(express.urlencoded({extended: true}))
  app.use("/graphql", expressMiddleware(server))
  app.use(morganMiddleware)
  app.use('/yape/v1', baseRouter);
  
  consumer().catch(Logger.error)

  app.listen(port, () => {
    Logger.debug(`🚀 Express ready at http://localhost:${port}`)
    Logger.debug(`🚀 Graphql ready at http://localhost:${port}/graphql`)
  })
}

bootstrapServer()
