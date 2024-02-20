import express from 'express';
import { configuration } from './infrastructure/config';
import logger from './infrastructure/logger';
import { databaseConnection } from './infrastructure/persistence/connection';
import { startServer } from './server';

async function bootstrap() {
  const app = express();

  await databaseConnection.initialize();
  logger.info('Connected to the database!');

  await startServer(app);

  app.listen(configuration.port, () => {
    logger.info(`Express server is listening at http://localhost:${configuration.port} 🚀`);
  });
}

bootstrap();
