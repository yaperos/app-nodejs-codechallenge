import { Router } from 'express';
/* Middleware Validator */
import { validateDTO } from "./infrastructure/middlewares/dtoValidator";
/* DTO Validator */
import { CreateTransactionDTO, GetTransactionDTO } from "./application/dto/TransactionDTO";
/* Controller */
import { TransactionController } from './interfaces/TransactionController';

const router = Router();
const transactionController = new TransactionController();

// Definición de Rutas
router.post('/transactions', validateDTO(CreateTransactionDTO),transactionController.createTransaction.bind(transactionController));
router.get('/transactions/:id', validateDTO(GetTransactionDTO),transactionController.getTransactionById.bind(transactionController));

export default router;
