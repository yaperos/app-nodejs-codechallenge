import { Router } from 'express';
import { TransactionController } from '../controllers/transaction.controller';

const router = Router();

router.post('/', TransactionController.create);
router.get('/:id', TransactionController.get);

export default router;
