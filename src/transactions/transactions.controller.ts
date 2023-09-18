import express, { NextFunction, Request, Response } from "express";
import * as TransactionService from "./transactions.service";
import { BaseTransaction, Transaction } from "./transactions.interface";

export const transactionsRouter = express.Router();

transactionsRouter.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const transaction: BaseTransaction = req.body;

    const newTransaction: Transaction = await TransactionService.createTransaction(transaction);

    res.status(201).json(newTransaction);
  } catch (e) {
    next(e);
  }
});

transactionsRouter.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const transactionId = req.params.id;

    const transaction = await TransactionService.fullTransaction(transactionId);

    res.status(200).json(transaction);
  } catch (e) {
    next(e);
  }
});

transactionsRouter.post('/callback', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = req.body;

    await TransactionService.processCallback(payload);

    res.sendStatus(200);
  } catch (e) {
    next(e);
  }
});