import { Router, Request, Response } from 'express';
import { CreateTransactionUseCase } from '../../../domain/use-cases/create-transaction.usecase';
import { GetTransactionUseCase } from '../../../domain/use-cases/get-transaction.usecase';

export class TransactionController {
  public router = Router();

  constructor(
    private readonly createUseCase: CreateTransactionUseCase,
    private readonly getUseCase: GetTransactionUseCase,
  ) {
    this.router.post('/transactions', this.create.bind(this));
    this.router.get('/transactions/:id', this.get.bind(this));
  }

  private async create(req: Request, res: Response) {
    const transaction = await this.createUseCase.execute(req.body);
    res.json(transaction);
  }

  private async get(req: Request, res: Response) {
    const transaction = await this.getUseCase.execute(req.params.id);
    if (!transaction) return res.status(404).json({ error: 'Not found' });
    res.json(transaction);
  }
}