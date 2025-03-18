import { Router } from 'express';
/* Middleware Validator */
import { validateDTO } from "./src/infrastructure/middlewares/dtoValidator";
/* DTO Validator */
import { CreateTransactionDTO, GetTransactionDTO } from "./src/application/dto/TransactionDTO";
/* Controller */
import { TransactionController } from './src/interfaces/TransactionController';

const router = Router();
const transactionController = new TransactionController();

// Definición de Rutas
router.post('/transactions', validateDTO(CreateTransactionDTO),transactionController.createTransaction.bind(transactionController));
router.get('/transactions', transactionController.getTransactionById.bind(transactionController));

export default router;
