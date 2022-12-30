import { Router } from 'express';
import { TransactionController } from '../controllers/transaction.controller';
import { TransactionRequest } from '../middlewares/transaction.request.middleware';

const router = Router();

router.post('/', TransactionRequest, TransactionController.create);
router.get('/:id', TransactionController.get);

export default router;
