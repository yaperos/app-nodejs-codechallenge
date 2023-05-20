import 'graphql-import-node';
import Express, { Application } from 'express';
import { json } from 'body-parser';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { resolvers } from './graphql/resolvers/resolvers';
import * as typeDefs from './graphql/schema/schema.gql';

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
    const server = new ApolloServer({
      typeDefs,
      resolvers: { ...resolvers },
    });

    await server.start();
    this.app.use('/graphql', expressMiddleware(server));
  }

  async start() {
    await this.graphql();
    const port = this.app.get('port');
    this.app.listen(port);
    console.info('App running on port', port);
  }
}
