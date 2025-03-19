import { Request, Response, NextFunction } from 'express';
import { TransactionService } from '../application/TransactionService';
import { TransactionRepository } from '../infrastructure/repository/TransactionRepository';

export class TransactionController {
    private transactionService: TransactionService;

    constructor() {
        const transactionRepository = new TransactionRepository(); 
        this.transactionService = new TransactionService(transactionRepository); 
    }

    createTransaction = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            
            const userId = (req as any).user.userId;
            
            const transaction = await this.transactionService.createTransaction(req.body, userId);

            res.status(201).json(transaction);
        } catch (error) {
            next(error);
        }
    }

    getTransactionById = async (req: Request<{ id: string }>, res: Response, next: NextFunction): Promise<void> => {
        try {
            // ID Opcional
            const { id } = req.query; 

            const transaction = await this.transactionService.obtainTransactions(id as string | undefined);

            res.status(200).json(transaction);
        } catch (error) {
            next(error);
        }
    }
}
