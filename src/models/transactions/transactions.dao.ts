import { type DaoFn } from '../../interfaces/IDao'
import { type TransactionConditions, type TransactionParams } from '../../interfaces/ITransactions'
import transactionModel from '../../database/models/transactions.model'

import * as transactionsHooks from './transactions.hooks'

export class TransactionsDao {
  private readonly transactionsModel = transactionModel

  getAll: DaoFn<Partial<TransactionConditions>> = async (conditions, options) => {
    const transactionsConditions = transactionsHooks.conditionsBuilder(conditions)

    const transactions = await transactionModel.findAll({
      where: transactionsConditions,
      include: []
    })

    return transactions
  }

  create: DaoFn<TransactionParams> = async (params) => {
    const createdTransaction = await this.transactionsModel.create({ ...params })

    return createdTransaction
  }
}
