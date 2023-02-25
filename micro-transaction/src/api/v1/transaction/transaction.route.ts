import { Router } from 'express';
import Controller from './transaction.controller';
import { catchError } from '../../../helpers/error.helper';

const router: Router = Router();
const controller = new Controller();

router.post('/', [], catchError(controller.crearTransaction));
router.get('/:transactionId', [], catchError(controller.obtenerTransactionPorId));


export default router;
