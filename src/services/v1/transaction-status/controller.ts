import { type RequestHandler } from 'express'

import { TransactionStatusService } from './index'

export class TransactionStatusController {
  getAll: RequestHandler = async (req, res, next) => {
    try {
      const aTransactionStatusService = new TransactionStatusService()

      const params = { ...req.query }

      const response = await aTransactionStatusService.getAll(params)

      return res.status(200).json({ data: response })
    } catch (error) {
      next(error)
    }
  }

  create: RequestHandler = async (req, res, next) => {
    try {
      const aTransactionStatusService = new TransactionStatusService()

      const params = { ...req.body }

      const response = await aTransactionStatusService.create(params)

      return res.status(200).json({ data: response })
    } catch (error) {
      next(error)
    }
  }
}
