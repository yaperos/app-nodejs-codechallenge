import { TransactionsDao } from './../../../models/transactions/transactions.dao'
import { type TransactionResponse } from './../../../interfaces/ITransactions'

export const getTransactions = async (): Promise<TransactionResponse[]> => {
  const transactionsDao = new TransactionsDao()
  const transactions = await transactionsDao.getAll({})

  return transactions.data
}
