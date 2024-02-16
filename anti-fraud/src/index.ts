import express from 'express';
import { configuration } from './config/configuration';
import { startServer } from './server';

async function bootstrap() {
  const app = express();

  await startServer(app);

  app.listen(configuration.port, () => {
    console.log(`Express server is listening at http://localhost:${configuration.port} 🚀`);
  });
}

bootstrap();
