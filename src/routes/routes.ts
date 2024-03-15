import TransactionController from '@/controllers/transaction/transaction.controller'
import { Router } from 'express'

const router: Router = Router()
const transactionController = new TransactionController()

router.post('/transaction', transactionController.create)
router.get('/transactions', transactionController.getTransactions)

export { router }
