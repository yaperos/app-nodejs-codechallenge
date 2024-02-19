import { Request, Response, Router } from 'express';
import { TransactionService } from '../../application/transaction.service';
import { RequestValidator } from '../../shared/request-validator';
import { CreateTransactionRequest, GetTransactionResponse } from '../dto/transaction.dto';
import { KafkaClient } from '../kafka/kafka.client';
import logger from '../logger';
import { TransactionRepository } from '../persistence/repository/transaction.repository';

const router = Router();
const transactionService = new TransactionService(new TransactionRepository(), new KafkaClient());

transactionService.handleUpdateStatusEvent();

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const transactionId = req.params.id;
    const response = await transactionService.getTransaction(transactionId);

    const { constraints, input } = await RequestValidator(GetTransactionResponse, response);
    if (constraints) return res.status(422).json({ error: constraints });

    res.status(200).json(input);
  } catch (err) {
    logger.error(err);
    res.status(500).json({ error: 'Error to get transaction' });
  }
});

router.post('/', async (req: Request, res: Response) => {
  try {
    const { constraints, input } = await RequestValidator(CreateTransactionRequest, req.body);
    if (constraints) return res.status(422).json({ error: constraints });

    const response = await transactionService.createTransaction(input);

    return res.status(201).json(response);
  } catch (err) {
    logger.error(err);
    res.status(500).json({ error: 'Error to create transaction' });
  }
});

export default router;
