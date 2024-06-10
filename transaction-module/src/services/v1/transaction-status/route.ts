import { Router } from 'express'

import { TransactionStatusController } from './controller'

const app: Router = Router()
const aTransactionStatusController = new TransactionStatusController()

app.get(
  '/',
  aTransactionStatusController.getAll
)

app.post(
  '/',
  aTransactionStatusController.create
)

export default app
