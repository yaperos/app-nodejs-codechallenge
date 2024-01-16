import express, { Request, Response, Router } from 'express'
/* Controllers */
import { GetTransactionController } from '../Controllers/TransactionController';

const router = Router();
const getTransactionController = new GetTransactionController();

router.get('/transaction/:uuid', getTransactionController.getTransaction);
router.put('/transaction/', getTransactionController.updateTransactionStatus);

export default router;
