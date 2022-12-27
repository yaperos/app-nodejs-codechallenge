import { Router } from 'express'
import expressAsyncHandler from 'express-async-handler'
import { TransactionController } from '../controller/transaction.controller'

export class TransactionRoute {
  private readonly expressRouter: Router

  constructor(private readonly controller: TransactionController) {
    this.expressRouter = Router()
    this.mountRoutes()
  }

  mountRoutes() {
    this.expressRouter.post('/', expressAsyncHandler(this.controller.createTransaction))
    this.expressRouter.get('/:id', expressAsyncHandler(this.controller.getTransaction))
  }

  get router() {
    return this.expressRouter
  }
}
