import { Router } from 'express'

import { TransactionController } from './controller'

const app: Router = Router()
const aTransactionController = new TransactionController()

app.get(
  '/',
  aTransactionController.getAll
)

app.post(
  '/',
  aTransactionController.create
)

export default app
