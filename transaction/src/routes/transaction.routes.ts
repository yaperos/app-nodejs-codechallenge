import { Router } from 'express';
import { TransactionController } from '../controllers/transaction.controller';

const router = Router();

router.get('/transactions/:id', TransactionController.getTransaction);
router.post('/transactions', TransactionController.createTransaction);

export default router;
