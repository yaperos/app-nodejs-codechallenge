import { Router } from 'express';
import health from '../controllers/health/health.route';
import transaction from '../controllers/transaction/transaction.route';
const baseRouter = Router();

baseRouter.use('/health', health);
baseRouter.use('/transaction', transaction);


export default baseRouter;
