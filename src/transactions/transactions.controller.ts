import express, { NextFunction, Request, Response } from "express";
import * as TransactionService from "./transactions.service";
import { BaseTransaction, Transaction } from "./transactions.interface";

export const transactionsRouter = express.Router();

/**
 * POST /api/v1/
 * @summary Endpoint to create a transaction
 * @returns {object} 201 - success response - application/json
 * @returns {string} 400 - Bad request response
 */
transactionsRouter.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const transaction: BaseTransaction = req.body;

    const newTransaction: Transaction = await TransactionService.createTransaction(transaction);

    res.status(201).json(newTransaction);
  } catch (e) {
    next(e);
  }
});

/**
 * GET /api/v1/:id
 * @summary Endpoint to retrieve a transaction
 * @returns {object} 200 - success response - application/json
 * @returns {string} 400 - Bad request response
 */
transactionsRouter.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const transactionId = req.params.id;

    const transaction = await TransactionService.fullTransaction(transactionId);

    res.status(200).json(transaction);
  } catch (e) {
    next(e);
  }
});

/**
 * POST /api/v1/callback
 * @summary Endpoint to process an anti-fraud service response
 * @returns 200 - success response
 */
transactionsRouter.post('/callback', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = req.body;

    await TransactionService.processCallback(payload);

    res.sendStatus(200);
  } catch (e) {
    next(e);
  }
});