import { Request, Response } from 'express'
import { plainToInstance } from 'class-transformer'
import { TransactionApplication } from '../../../application/transaction.application'

import { CreateTransactionRequest } from '../dtos/request/create-transaction.request'

export class TransactionController {
  constructor(private readonly transactionApplication: TransactionApplication) {
    this.createTransaction = this.createTransaction.bind(this)
    this.getTransaction = this.getTransaction.bind(this)
  }

  public async getTransaction(req: Request, res: Response) {
    const transaction = await this.transactionApplication.getTransaction('id')

    res.send({ transaction })
  }

  public async createTransaction(req: Request, res: Response) {
    const request = plainToInstance(CreateTransactionRequest, req.body)
    await request.isValid()
    const transaction = await this.transactionApplication.registerTransaction(req.body)

    res.send({ transaction })
  }
}
