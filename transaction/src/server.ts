import cors from 'cors';
import express from 'express';
import TransactionControllers from './infrastructure/controllers/transaction.controllers';

export const startServer = async (app: express.Application) => {
  app.use(cors());
  app.disable('x-powered-by');
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use('/api/v1/transactions', TransactionControllers);

  app.get('/', async (req, res) => {
    res.json({ message: 'Yape Challenge API' });
  });
};
