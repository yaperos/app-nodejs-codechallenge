import { Router } from 'express';
import { createTransaction, getTransactionById } from '../controllers/TransactionController';

const router = Router();

router.post('/', createTransaction);

router.get('/:id', getTransactionById);

export default router;