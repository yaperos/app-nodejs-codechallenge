import { MessageKeys } from '../../../constants/message-queue.constants'
import { TransactionStatus } from '../../../constants/transactions-status.constants'
import { TransactionsDao } from '../../../models/transactions/transactions.dao'
import { TransactionStatusDao } from '../../../models/transaction-status/transaction-status.dao'
import { type TransactionConditions, type TransactionResponse, type TransactionParams, type Transaction } from '../../../interfaces/ITransactions'

import * as hooks from './hooks'
export class TransactionService {
  async getAll (conditions: Partial<TransactionConditions>): Promise<{ data: TransactionResponse[], pagination: object }> {
    const aTransactionsDao = new TransactionsDao()

    const transactions = await aTransactionsDao.getAll(conditions)

    return transactions
  }

  async create (params: TransactionParams): Promise<Transaction> {
    const aTransactionsDao = new TransactionsDao()
    const aTransactionStatusDao = new TransactionStatusDao()

    const initialTransactionStatus = await aTransactionStatusDao.getOne({ name: TransactionStatus.PENDING })

    const transaction = await aTransactionsDao.create({
      ...params,
      transaction_status_id: initialTransactionStatus.transaction_status_id
    })

    await hooks.sendMessageToMessageQueue(MessageKeys.TRANSACTION_CREATED, transaction)

    return transaction
  }
}
