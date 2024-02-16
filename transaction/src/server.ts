import cors from 'cors';
import express from 'express';
import TransactionRoutes from './routes/transaction.routes';

export const startServer = async (app: express.Application) => {
  app.use(cors());
  app.disable('x-powered-by');
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use('/api/transactions', TransactionRoutes);

  app.get('/', async (req, res) => {
    res.json({ message: 'Hello World' });
  });
};
