import { Router } from 'express';
import TransactionController from "./transaction.controller";

const controller = new TransactionController();
const router = Router();

router.post('/', controller.createTransaction);
router.get('/:id', controller.obtainTransaction);

export default router;