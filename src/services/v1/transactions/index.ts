import { TransactionsDao } from '../../../models/transactions/transactions.dao'
import { type TransactionConditions, type TransactionResponse, type TransactionParams, type Transaction } from '../../../interfaces/ITransactions'

export class TransactionService {
  async getAll (conditions: Partial<TransactionConditions>): Promise<TransactionResponse[]> {
    const aTransactionsDao = new TransactionsDao()

    const transactions = await aTransactionsDao.getAll(conditions)

    return transactions
  }

  async create (params: TransactionParams): Promise<Transaction> {
    console.log('LOG ~ create ~ params:', params)
    const aTransactionsDao = new TransactionsDao()

    const transaction = await aTransactionsDao.create(params)

    return transaction
  }
}
