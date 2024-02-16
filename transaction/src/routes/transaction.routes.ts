import { Request, Response, Router } from 'express';
import { ITransactionRequest } from '../interfaces/transaction.interface';
import { KafkaClient } from '../kafka/kafka.client';
import { TransactionService } from '../services/transaction.service';

const router = Router();
const kafka = new KafkaClient();
const transactionService = new TransactionService();

kafka.consumeMessage(transactionService);

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const transactionId = req.params.id;
    const response = await transactionService.getTransaction(transactionId);
    res.status(200).json(response);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Error to get transaction' });
  }
});
router.post('/', async (req: Request, res: Response) => {
  try {
    const body: ITransactionRequest = req.body;
    const response = await transactionService.createTransaction(body);
    res.status(201).json(response);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Error to create transaction' });
  }
});

export default router;
