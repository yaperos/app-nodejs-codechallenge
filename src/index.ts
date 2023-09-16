import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import 'dotenv/config';
import { transactionsRouter } from './transactions/transactions.controller';

require('dotenv').config();

if (!process.env.PORT) process.exit(1);

const PORT: number = parseInt(process.env.PORT as string, 10);

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use('/api', transactionsRouter);

const start = async () => {
  try {
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();