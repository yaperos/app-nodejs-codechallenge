import 'reflect-metadata';
import { Server } from './Server';
import config from '@app/config';
import graphqlServer from '@context/shared/infrastructure/adapters/graphql/conf';
import { AppDataSource } from '@context/shared/infrastructure/persistence/typeorm/conf/typeorm.config';
import Logger from '@context/shared/infrastructure/impl/WinstonInfoLogger';

export class Run {
  server?: Server;

  async start() {
    this.server = new Server(Number(config.PORT));
    try {
      const typeORM = await AppDataSource.initialize();

      if (typeORM.isInitialized) {
        Logger.info('Connected to database!');
      }

      await graphqlServer.start();
      graphqlServer.applyMiddleware({ app: this.server.app as any, path: '/graphql' });
    } catch (error) {
      Logger.info(`Run Error -> ${JSON.stringify(error)}`);
    }
    return this.server.listen();
  }

  async stop() {
    return this.server?.stop();
  }

  get httpServer() {
    return this.server?.getHTTPServer();
  }
}
