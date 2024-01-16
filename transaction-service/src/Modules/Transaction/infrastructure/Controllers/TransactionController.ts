import { Request, Response } from 'express';
import { Logger } from "../../../../Shared/infrastructure/Logger";
import { TransactionService } from '../../application/services/transaction-status/transactionService';
import { UuidValueObject } from '../../../../Shared/valueObjects/uuidValueObject';
import { TransactionStatusValueObject } from '../../../../Shared/valueObjects/transactionStatusValueObject';

export class GetTransactionController { 

    async getTransaction(req: Request, res: Response) {
        const transactionService = new TransactionService();
        const logger = new Logger();
        try {
            const uuidVO = new UuidValueObject(req.params.uuid);
            const response = await transactionService.getTransaction(uuidVO.toString().trim());
            res.json(response);
        } catch (error) {
            if (error instanceof Error) {
                console.log(`Error in getTransaction: ${error.message}`);
                if (error.message === 'Invalid UUID format') {
                    res.status(400).json({ error: 'Invalid UUID format' });
                } else {
                    res.status(500).json({ error: 'Internal Server Error' });
                }
            } else {
                res.status(500).json({ error: 'Internal Server Error' });
            }
        }
    }

    async updateTransactionStatus(req: Request, res: Response): Promise<void> {
        try {
            const transactionService = new TransactionService();
            const logger = new Logger();
            const uuid = req.body.uuid;
            const statusVO = new TransactionStatusValueObject(req.body.status);
            const response = await transactionService.updateTransactionStatus(uuid, statusVO.toString());
            res.json(response);
        } catch (error) {
            if (error instanceof Error) {
                console.log(`Error updating transaction status: ${error.message}`);
                res.status(400).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'Internal Server Error' });
            }
        }
    }

}
