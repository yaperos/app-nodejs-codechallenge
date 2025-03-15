import { Router } from 'express';
/* Middleware Validator */
import { validateDTO } from "./infrastructure/middlewares/dtoValidator";
/* DTO Validator */
import { CreateTransactionDTO } from "./application/dto/TransactionDTO";
/* Controller */
import { TransactionController } from './interfaces/transaction.controller';

const router = Router();
const transactionController = new TransactionController();

// Definición de Rutas
router.post('/transactions', validateDTO(CreateTransactionDTO),transactionController.createTransaction.bind(transactionController));
router.get('/transactions/:id', transactionController.getTransactionById.bind(transactionController));

export default router;
