import { Router } from 'express';

import transaction from './transaction/transaction.route';



const router: Router = Router();

router.use('/transaction', transaction);

export default router;
