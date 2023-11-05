import { type RequestHandler } from 'express'

import { TransactionService } from './index'

export class TransactionController {
  getAll: RequestHandler = async (req, res, next) => {
    try {
      const aTransactionService = new TransactionService()

      const params = { ...req.query }

      const response = await aTransactionService.getAll(params)

      return res.status(200).json({ data: response })
    } catch (error) {
      next(error)
    }
  }

  create: RequestHandler = async (req, res, next) => {
    try {
      const aTransactionService = new TransactionService()

      const params = { ...req.body }

      const response = await aTransactionService.create(params)

      return res.status(200).json({ data: response })
    } catch (error) {
      next(error)
    }
  }
}
