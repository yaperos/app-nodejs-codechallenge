import { Request, Response } from 'express';
import { ITransactionRequest } from '../interfaces/transaction.interface';
import { TransactionService } from '../services/transaction.service';

const transactionService = new TransactionService();

export class TransactionController {
  static async getTransaction(req: Request, res: Response) {
    try {
      const transactionId = req.params.id;
      const response = await transactionService.getTransaction(transactionId);
      res.status(200).json(response);
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: 'Error to get transaction' });
    }
  }

  static async createTransaction(req: Request, res: Response) {
    try {
      const body: ITransactionRequest = req.body;
      const response = await transactionService.createTransaction(body);
      res.status(201).json(response);
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: 'Error to create transaction' });
    }
  }
}
