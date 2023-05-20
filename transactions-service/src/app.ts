import 'graphql-import-node';
import Express, { Application } from 'express';
import { json } from 'body-parser';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { PrismaClient } from '@prisma/client';
import { Query } from './graphql/resolvers/query';
import { Mutation } from './graphql/resolvers/mutation';
import * as typeDefs from './graphql/schema/schema.gql';
import { AppContext } from './@types/types';
import { TransactionService } from './modules/transaction/transaction.service';

export class App {
  private app: Application;

  // eslint-disable-next-line no-unused-vars
  constructor(private port?: number | string) {
    this.app = Express();
    this.settings();
    this.middleware();
  }

  settings() {
    this.app.set('port', this.port || process.env.PORT || 3000);
  }

  middleware() {
    this.app.use(json());
  }

  async graphql() {
    const server = new ApolloServer<AppContext>({
      typeDefs,
      resolvers: { Query, Mutation },
    });

    await server.start();
    this.app.use('/graphql', expressMiddleware(server, {
      context: async () => {
        const prismaClient = new PrismaClient();
        const transactionService = new TransactionService(prismaClient);
        return { transactionService };
      },
    }));
  }

  async start() {
    await this.graphql();
    const port = this.app.get('port');
    this.app.listen(port);
    console.info('App running on port', port);
  }
}
