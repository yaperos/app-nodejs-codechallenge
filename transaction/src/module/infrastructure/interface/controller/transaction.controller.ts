import { Request, Response } from 'express'
import { TransactionApplication } from '../../../application/transaction.application'

export class TransactionController {
  constructor(private readonly transactionApplication: TransactionApplication) {}

  public async getTransaction(req: Request, res: Response) {
    const transaction = await this.transactionApplication.getTransaction('id')

    res.send({ transaction })
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async createTransaction(req: Request, res: Response) {
    const transaction = await this.transactionApplication.registerTransaction(req.body)

    res.send({ transaction })
  }
}
