import { Router } from 'express';
/* Middleware's */
import { validateDTO } from "./src/infrastructure/middlewares/dtoValidator";
import { groupMiddleware } from "./src/infrastructure/middlewares/groupMiddleware";
import { authMiddleware } from "./src/infrastructure/middlewares/authMiddleware";
/* DTO Validator */
import { CreateTransactionDTO, LoginUserDTO } from "./src/application/dto/TransactionDTO";
/* Controller */
import { TransactionController } from './src/interfaces/TransactionController';
import { LoginController } from './src/interfaces/LoginController';

const router = Router();
const loginController = new LoginController();
const transactionController = new TransactionController();

// Definición de Rutas
/* Rutas Públicas */
const publicRouter = Router();

publicRouter.post("/login", validateDTO(LoginUserDTO), loginController.login);

/* Rutas Protegidas */
const protectedRoutes = Router();
groupMiddleware([authMiddleware], protectedRoutes);

protectedRoutes.post('/transactions', validateDTO(CreateTransactionDTO),transactionController.createTransaction);
protectedRoutes.get('/transactions', transactionController.getTransactionById);

/* Montamos las rutas */
router.use("/public", publicRouter);
router.use("/auth", protectedRoutes);

export default router;
