import { Router } from 'express';
import TransactionController from '../controller/TransacionController'

const routerTransaction = Router();
const transactionController = new TransactionController();

routerTransaction.post('/', transactionController.createTransaction);

export default routerTransaction;
