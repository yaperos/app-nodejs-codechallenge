import 'graphql-import-node';
import Express, { Application } from 'express';
import { json } from 'body-parser';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { PrismaClient, TransactionStatus } from '@prisma/client';
import { config } from 'dotenv';
import { Server } from 'http';
import { Query } from './graphql/resolvers/query';
import { Mutation } from './graphql/resolvers/mutation';
import * as typeDefs from './graphql/schema/schema.gql';
import { AppContext } from './@types';
import { TransactionService } from './modules/transaction/transaction.service';
import { TransactionController } from './modules/transaction/transaction.controller';
import { KafkaClient } from './config/kafka';
import { EventStreamer } from './config/event.streamer.interface';

export class App {
  private app: Application;

  private eventStreamer?: EventStreamer;

  private prismaClient?: PrismaClient;

  // eslint-disable-next-line no-unused-vars
  constructor(private port?: number | string) {
    this.app = Express();
    config();
    this.settings();
    this.middleware();
  }

  settings() {
    this.app.set('port', this.port || process.env.PORT || 3000);
  }

  middleware() {
    this.app.use(json());
  }

  async setup() {
    // Create new prisma client
    const prismaClient = new PrismaClient();
    this.prismaClient = prismaClient;

    // Create new event streamer instance
    const kafka = new KafkaClient('transaction-app', process.env.KAFKA_HOST_URL ?? '');
    this.eventStreamer = kafka;

    const transactionService = new TransactionService(prismaClient, kafka);
    const transactionController = new TransactionController(transactionService);

    kafka.createSubscription({
      topic: 'transaction-approved',
    }, (message) => {
      transactionController.handleUpdateTransactionStatus(
        message.value?.toString() ?? '',
        TransactionStatus.APPROVED
      );
    });

    kafka.createSubscription({
      topic: 'transaction-rejected',
    }, (message) => {
      transactionController.handleUpdateTransactionStatus(
        message.value?.toString() ?? '',
        TransactionStatus.REJECTED
      );
    });

    // Create new Apollo Server
    const server = new ApolloServer<AppContext>({
      typeDefs,
      resolvers: { Query, Mutation },
    });
    // Start server to use it as an express middleware
    await server.start();

    // Setup graphql
    this.app.use('/graphql', expressMiddleware(server, {
      context: async () => ({ transactionService }),
    }));
  }

  close(server: Server) {
    server.close(() => {
      console.info('Server closed');
      this.eventStreamer?.closeConnections().then(() => console.info('Event streamer connections closed'));
      this.prismaClient?.$disconnect().then(() => console.info('Prisma client closed'));
    });
  }

  async start() {
    await this.setup();
    const port = this.app.get('port');
    const server = this.app.listen(port);
    console.info('App running on port', port);

    process.on('SIGTERM', () => this.close(server));
    process.on('SIGINT', () => this.close(server));
  }
}
