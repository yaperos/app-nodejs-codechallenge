import { type TransactionTypes } from '../../../interfaces/ITransactionTypes'
import { TransactionTypesDao } from '../../../models/transaction-types/transaction-types.dao'

export class TransactionTypesService {
  async getAll (conditions: Partial<TransactionTypes>): Promise<TransactionTypes[]> {
    const aTransactionsTypesDao = new TransactionTypesDao()

    const transactions = await aTransactionsTypesDao.getAll(conditions)

    return transactions
  }

  async create (params: TransactionTypes): Promise<TransactionTypes> {
    const aTransactionsTypesDao = new TransactionTypesDao()

    const transaction = await aTransactionsTypesDao.create(params)

    return transaction
  }
}
