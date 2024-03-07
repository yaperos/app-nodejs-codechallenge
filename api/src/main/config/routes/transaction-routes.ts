import { Router } from 'express';
import { adapterRoute } from 'main/adapters/express/express-routes-adapter';
import { makeCreateTransactionController } from 'main/factories/controllers/transaction/create/create-transaction-controller-factory';

const transactionRouter = Router();

transactionRouter.post('/v1/create', adapterRoute(makeCreateTransactionController()));

export { transactionRouter };
