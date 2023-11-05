import { type DaoFn } from '../../interfaces/IDao'
import transactionTypes from '../../database/models/transaction-types.model'
import { type TransactionTypes } from '../../interfaces/ITransactionTypes'

import * as transactionsHooks from './transaction-types.hooks'

export class TransactionTypesDao {
  private readonly transactionTypesModel = transactionTypes

  getAll: DaoFn<Partial<TransactionTypes>> = async (conditions) => {
    const transactionTypeConditions = transactionsHooks.conditionsBuilder(conditions)

    const transactionTypes = await this.transactionTypesModel.findAll({
      where: transactionTypeConditions
    })

    return transactionTypes
  }

  create: DaoFn<TransactionTypes> = async (params) => {
    const createdTransactionType = await this.transactionTypesModel.create({ ...params })

    return createdTransactionType
  }
}
