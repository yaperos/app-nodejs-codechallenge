import express, { Request, Response } from 'express';
import { TransactionController } from '../controllers/transactionController';
import { PrismaClient } from '@prisma/client';
import { TransactionPostgresRepository } from '../repositories/transactionPostgresRepository';
import { EventNotificator } from '../services/EventNotificator';
import { TransactionMongoRepository } from '../repositories/transactionMongoRepository';
import { internalAuthenticate, authenticate } from '../middlewares/authenticate';

const router = express.Router();
const prisma = new PrismaClient();
const eventNotificator = new EventNotificator();
const postgresRepository = new TransactionPostgresRepository(prisma);
const mongoRepository = new TransactionMongoRepository();

let writeController = new TransactionController(postgresRepository, eventNotificator);
let readController = new TransactionController(mongoRepository, eventNotificator);

router.post('/transactions', [authenticate], writeController.create.bind(writeController));
router.get('/transactions/:id', [authenticate], readController.findById.bind(readController));

router.put('/internal/transactions/:id/reject', [internalAuthenticate], writeController.reject.bind(writeController));
router.put('/internal/transactions/:id/approve', [internalAuthenticate], writeController.approve.bind(writeController));

export default router;
