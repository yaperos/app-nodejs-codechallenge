import express, { Request, Response } from "express";
import * as TransactionService from "./transactions.service";
import { BaseTransaction, Transaction } from "./transactions.interface";

export const transactionsRouter = express.Router();

transactionsRouter.post('/', async (req: Request, res: Response) => {
  try {
    const transaction: BaseTransaction = req.body;

    const newTransaction: Transaction = await TransactionService.createTransaction(transaction);

    res.status(201).json(newTransaction);
  } catch (e) {
    if (e instanceof Error) {
      res.status(500).send(e.message);
    } else {
      res.status(500).send(`Unexpected error: ${e}`);
    }
  };
});