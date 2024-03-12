import { Request, Response } from 'express'
import { randomUUID } from 'node:crypto'
import { ITransaction, TransactionStatus } from '@/types/transaction.type'
import { ProducerTransaction } from '@/producers/transaction.producer'
import { Transaction } from '@/models/transaction/transaction.model'

const topic = process.env.TOPIC

export default class TransactionController {
  public async create(req: Request, res: Response): Promise<Response> {
    
    const { tranferTypeId, value } = req.body
    const defaultStatusTransaction = "PENDING" as unknown as TransactionStatus

    const payload = {
      transactionId: randomUUID(),
      accountExternalIdDebit: randomUUID(),
      accountExternalIdCredit: randomUUID(),
      transactionStatus: defaultStatusTransaction,
      tranferTypeId,
      value
    } as ITransaction

    // save in DB
    const newTransaction = await Transaction.create(payload)
    const { _id } = await newTransaction.save()

    // producer transaction
    await ProducerTransaction(
      topic,
      payload.transactionId,
      {
        _id,
        ...payload
      }
    )

    return res.status(201).json(payload)
  }
}
