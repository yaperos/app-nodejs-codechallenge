import { Router } from 'express'

import transactions from './transactions/route'
import transactionTypes from './transactions-types/route'
import transactionStatus from './transaction-status/route'

const app: Router = Router()

app.use('/transactions', transactions)
app.use('/transactions-types', transactionTypes)
app.use('/transactions-status', transactionStatus)

export default app
