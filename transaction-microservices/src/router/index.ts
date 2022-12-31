import { Router } from 'express';

import roleRouter from './role.routes';
import userRouter from './user.routes';
import transactionRouter from './transaction.routes';

const router = Router();

router.use('/roles', roleRouter);
router.use('/users', userRouter);
router.use('/transactions', transactionRouter);

export default router;
