import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import 'reflect-metadata';
import { routerTransaction } from './routes/transactionRouter';
import { Sync } from './database/dbConfig';
import KafkaConsumer from './services/kafka/KafkaConsumer';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server');
});

app.use('/transactions', routerTransaction);

const start = async (): Promise<void> => {
  try {
    await Sync(); // Synchronizes the database with the defined entities
    app.listen(port, () => {
      // Starts the server on port 3000
      console.log(`[server]: Server is running at http://localhost:${port}`);
    });

    const kafkaConsumer = new KafkaConsumer(
      'transactions-approved',
      KafkaConsumer.TOPIC_TRANSACTION_APPROVED
    );
    await kafkaConsumer.run();

    const kafkaConsumer2 = new KafkaConsumer(
      'transactions-rejected',
      KafkaConsumer.TOPIC_TRANSACTION_REJECTED
    );
    await kafkaConsumer2.run();
  } catch (error) {
    console.error(error); // Logs any errors that occur
    process.exit(1); // Exits the process with an error status code
  }
};

void start(); // Invokes the start function to start the serve
