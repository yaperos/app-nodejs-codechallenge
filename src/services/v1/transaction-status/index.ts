import { type TransactionStatus } from '../../../interfaces/ITransactionStatus'
import { TransactionStatusDao } from '../../../models/transaction-status/transaction-status.dao'

export class TransactionStatusService {
  async getAll (conditions: Partial<TransactionStatus>): Promise<TransactionStatus[]> {
    const aTransactionStatusDao = new TransactionStatusDao()

    const transactionStatus = await aTransactionStatusDao.getAll(conditions)

    return transactionStatus
  }

  async create (params: TransactionStatus): Promise<TransactionStatus> {
    const aTransactionStatusDao = new TransactionStatusDao()

    const transaction = await aTransactionStatusDao.create(params)

    return transaction
  }
}
