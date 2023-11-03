import { type RequestHandler } from 'express'

import { TransactionTypesService } from './index'

export class TransactionTypesController {
  getAll: RequestHandler = async (req, res, next) => {
    try {
      const aTransactionTypesService = new TransactionTypesService()

      const params = { ...req.query }

      const response = await aTransactionTypesService.getAll(params)

      return res.status(200).json({ data: response })
    } catch (error) {
      next(error)
    }
  }

  create: RequestHandler = async (req, res, next) => {
    try {
      const aTransactionTypesService = new TransactionTypesService()

      const params = { ...req.body }

      const response = await aTransactionTypesService.create(params)

      return res.status(200).json({ data: response })
    } catch (error) {
      next(error)
    }
  }
}
