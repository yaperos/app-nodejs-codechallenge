import { Router } from 'express';
import { TransactionController } from './interfaces/transaction.controller';

const router = Router();
const transactionController = new TransactionController();

// Definición de Rutas
router.post('/transactions', transactionController.createTransaction.bind(transactionController));
router.get('/transactions/:id', transactionController.getTransactionById.bind(transactionController));

export default router;
