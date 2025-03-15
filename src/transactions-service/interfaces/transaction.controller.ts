import { Request, Response, NextFunction } from 'express';
import { TransactionService } from '../application/TransactionService';
import { TransactionRepository } from '../infrastructure/repository/TransactionRepository';
import { NotFoundError } from '../infrastructure/middlewares/errorMiddleware';

export class TransactionController {
    private transactionService: TransactionService;

    constructor() {
        const transactionRepository = new TransactionRepository(); 
        this.transactionService = new TransactionService(transactionRepository); 
    }

    async createTransaction(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const transaction = await this.transactionService.createTransaction(req.body);
            res.status(201).json(transaction);
        } catch (error) {
            next(error);
        }
    }

    async getTransactionById(req: Request<{ id: string }>, res: Response, next: NextFunction): Promise<void> {
        try {
            const transaction = await this.transactionService.getTransactionById(req.params.id);

            if (!transaction) {
                throw new NotFoundError('La transacción solicitada no fue encontrada.');
            }

            res.status(200).json(transaction);
        } catch (error) {
            next(error);
        }
    }
}
