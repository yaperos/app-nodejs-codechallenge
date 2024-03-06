import { Router } from 'express';
import { transactionRouter } from './transaction-routes';

const router = Router();

router.get('/', (_: any, res: any) => res.status(200).json());

router.use('/transaction', transactionRouter);

export { router };
