import TransactionController from '@/controllers/transaction/transaction.controller'
import { Router } from 'express'

const router: Router = Router()
const transactionController = new TransactionController()

router.get('/transaction', transactionController.create)

export { router }
