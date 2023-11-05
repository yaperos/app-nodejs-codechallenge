import { Router } from 'express'

import { TransactionTypesController } from './controller'

const app: Router = Router()
const aTransactionTypesController = new TransactionTypesController()

app.get(
  '/',
  aTransactionTypesController.getAll
)

app.post(
  '/',
  aTransactionTypesController.create
)

export default app
