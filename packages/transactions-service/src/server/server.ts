import { type Server, createServer as createHttpServer } from 'http'
import Keyv from 'keyv'
import { KeyvAdapter } from '@apollo/utils.keyvadapter'
import { ApolloServer } from 'apollo-server-express'
import { ApolloServerPluginDrainHttpServer, ApolloServerPluginLandingPageLocalDefault, type PluginDefinition } from 'apollo-server-core'
import express, { json, urlencoded } from 'express'
import { logger } from '../shared/imports'
import requestLoggerPlugin from './pluggins/requestLogger.plugin'
import TransactionTypeDef from './schema/definitions/transactions.df'
import TransactionResolvers from './schema/resolvers/transactions.rv'

const privatePlugins: PluginDefinition[] = [
  requestLoggerPlugin
]

function apolloServerCacheManager (): KeyvAdapter {
  const { REDIS_HOST, REDIS_PORT } = process.env
  const host: string = REDIS_HOST ?? 'redis'
  const port: string | number = REDIS_PORT ?? 6379
  return new KeyvAdapter(new Keyv(`redis://${host}:${port}`))
}

function createApolloServer (server: Server): ApolloServer {
  return new ApolloServer({
    typeDefs: TransactionTypeDef,
    resolvers: TransactionResolvers,
    csrfPrevention: true,
    cache: apolloServerCacheManager(),
    plugins: [
      ...privatePlugins,
      ApolloServerPluginDrainHttpServer({ httpServer: server }),
      ApolloServerPluginLandingPageLocalDefault({ embed: true })]
  })
}

async function startServer (port: string | number, postRun?: (...params: any) => void | Promise<void>): Promise<void> {
  const location: string = 'Server.ts'
  const app = express()
  app.use(json({ limit: '10mb' }))
  app.use(urlencoded({ extended: true }))
  const httpServer = createHttpServer(app)
  try {
    const server = createApolloServer(httpServer)
    await server.start()
    server.applyMiddleware({ app: app as any })
    await new Promise<void>((resolve) => httpServer.listen(port, resolve))
    logger.logDebug(`🚀 Server ready at http://localhost:${port}/graphql`, location)
  } catch (error: any) {
    logger.logError(`An error has ocurred while startup ${error}`, location)
    process.exit(1)
  }
}

export default startServer
