import express from 'express';
import { configuration } from './config/configuration';
import { databaseConnection } from './config/database';
import { startServer } from './server';

async function bootstrap() {
  const app = express();

  await databaseConnection.initialize();
  console.log('Connected to the database');

  await startServer(app);

  app.listen(configuration.port, () => {
    console.log(`Express server is listening at http://localhost:${configuration.port} 🚀`);
  });
}

bootstrap();
