import 'dotenv/config';
import express, { json } from 'express';
import cors from 'cors';
import logger from './libs/logger';
import database from './libs/database';
import { kafkaProducer } from './libs/kafka';
import { errorHandler } from './middlewares/errorHandler';
import { routeLogger } from './middlewares/routeLogger';
import transactionRouter from './routes/transactionRouter';
import { subscribeTransactionTopics } from './subscribers/transactionSubscriber';

const start = async () => {
  const app = express();
  const port = process.env.NODE_PORT;

  app.use(cors());
  app.use(json({ limit: '50mb' }));
  app.use(express.static('public'));

  app.use(routeLogger);

  app.use(`/api`, transactionRouter);

  app.use(errorHandler);

  app.listen(port, async () => {
    await database.connect();
    await kafkaProducer.connect();
    await subscribeTransactionTopics();

    logger.info(`Server is running on http://localhost:${port}`);
  });
};

start();
