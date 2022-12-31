import { Router } from 'express';

import roleRouter from './role.routes';
import userRouter from './user.routes';

const router = Router();

router.use('/roles', roleRouter);
router.use('/users', userRouter);

export default router;
