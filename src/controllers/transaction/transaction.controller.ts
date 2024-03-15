import { Request, Response } from 'express'
import { randomUUID } from 'node:crypto'
import { ITransaction, TransactionStatus } from '@/types/transaction.type'
import { ProducerTransaction } from '@/producers/transaction.producer'
import { Transaction } from '@/models/transaction/transaction.model'
import { maperResponseTransactions } from '@/utils/maperResponseTransactions'

const topic = process.env.TOPIC

export default class TransactionController {
  public async create(req: Request, res: Response): Promise<Response> {
    
    const { tranferTypeId, value } = req.body
    const defaultStatusTransaction = "PENDING" as unknown as TransactionStatus

    if(value > 1000){
      return res.status(400).json({
        data: null,
        message: 'Transaction exceeds the minimum amount allowed'
      })
    }

    const payload = {
      transactionId: randomUUID(),
      accountExternalIdDebit: randomUUID(),
      accountExternalIdCredit: randomUUID(),
      transactionStatus: defaultStatusTransaction,
      tranferTypeId,
      value,
      createdAt: new Date().toISOString()
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

  public async getTransactions(req: Request, res: Response): Promise<Response> {
    const data = await Transaction.find().sort('-createdAt').exec();

    const transactions = maperResponseTransactions(data)

    return res.status(200).json({data: transactions})
  }
}
