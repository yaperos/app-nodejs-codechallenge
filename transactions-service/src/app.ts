import 'graphql-import-node';
import Express, { Application } from 'express';
import { json } from 'body-parser';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { PrismaClient } from '@prisma/client';
import { Server } from 'http';
import { Query } from './graphql/resolvers/query';
import { Mutation } from './graphql/resolvers/mutation';
import * as typeDefs from './graphql/schema/schema.gql';
import { AppContext, Symbols } from './@types';
import { EventStreamer } from './config/event.streamer.interface';
import { LoggerPlugin } from './utils/apollo.server.logger';
import { appContainer } from './config/inversify.container';
import { buildTransactionConsumers } from './modules/transaction/transaction.consumers';
import { TransactionController } from './modules/transaction/transaction.controller';
import environment from './environment';

export class App {
  /** Express application instance */
  private app: Application;

  /** Event Streamer instance */
  private eventStreamer?: EventStreamer;

  /** Prisma client instance */
  private prismaClient?: PrismaClient;

  // eslint-disable-next-line no-unused-vars
  constructor(private port?: number | string) {
    // Create express application
    this.app = Express();

    // Setup settings
    this.settings();

    // Setup middlewares
    this.middleware();
  }

  settings() {
    // Set port
    this.app.set('port', this.port || environment.PORT || 3000);
  }

  middleware() {
    // Set body-parser middleware for json requests
    this.app.use(json());
  }

  async setup() {
    // Get prisma client instance
    this.prismaClient = appContainer.get(PrismaClient);

    // Get event streamer instance
    this.eventStreamer = appContainer.get<EventStreamer>(Symbols.EventStreamer);

    // Get transaction service for app context
    const transactionController = appContainer.get(TransactionController);

    // Setup Transaction consumers
    buildTransactionConsumers();

    // Create new Apollo Server
    const server = new ApolloServer<AppContext>({
      typeDefs,
      resolvers: { Query, Mutation },
      introspection: process.env.NODE_ENV !== 'production',
      plugins: [LoggerPlugin],
    });

    // Start server to use it as an express middleware
    await server.start();

    // Setup graphql
    this.app.use('/graphql', expressMiddleware(server, {
      context: async () => ({ transactionController }),
    }));
  }

  close(server: Server) {
    // Close server
    server.close(() => {
      console.info('Server closed');

      // Close event streamer connections
      this.eventStreamer?.closeConnections().then(() => console.info('Event streamer connections closed'));

      // Close prisma client connection
      this.prismaClient?.$disconnect().then(() => console.info('Prisma client closed'));

      // Remove container bindings
      appContainer.unbindAll();
    });
  }

  async start() {
    // Call setup method
    await this.setup();

    // Get defined app port
    const port = this.app.get('port');

    // Start express server
    const server = this.app.listen(port);
    console.info('App running on port', port);

    // Define server end callbacks
    process.on('SIGTERM', () => this.close(server));
    process.on('SIGINT', () => this.close(server));
  }
}
