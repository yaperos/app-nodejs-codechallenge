import { Router } from 'express';
import { CreateTransactionMiddleware } from '../middleware/CreateTransactionMiddleware';
import {
  createTransaction,
  getTransaction
} from '../controllers/TransactionController';
import { GetTransactionMiddleware } from '../middleware/GetTransactionMiddleware';

export const routerTransaction = Router();

routerTransaction.post('/', CreateTransactionMiddleware, createTransaction);
routerTransaction.get(
  '/:transactionExternalId',
  GetTransactionMiddleware,
  getTransaction
);
