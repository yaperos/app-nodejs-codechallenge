import { Router } from 'express'
import expressAsyncHandler from 'express-async-handler'
import { TransactionInfrastructure } from '../../transaction.infrastructure'
import { TransactionApplication } from '../../../application/transaction.application'
import { TransactionController } from '../controller/transaction.controller'

// const route = Router()

// const transactionInfrastructure = new TransactionInfrastructure()
// const transactionApplication = new TransactionApplication(transactionInfrastructure)
// const transactionController = new TransactionController(transactionApplication)

// route.post('/transaction', expressAsyncHandler(transactionController.createTransaction))
// route.get('/transaction/:id', expressAsyncHandler(transactionController.getTransaction))

// export default route

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
