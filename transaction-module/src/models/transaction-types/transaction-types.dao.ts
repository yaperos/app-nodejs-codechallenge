import type Model from 'sequelize/types/model'
import { type DaoFn } from '../../interfaces/IDao'
import { type TransactionTypes } from '../../interfaces/ITransactionTypes'
import transactionTypes from '../../database/models/transaction-types.model'

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

  bulkCreate = async (transactions: any[]): Promise<Array<Model<any, any>>> => {
    const transactionsTypesCreated = await this.transactionTypesModel.bulkCreate(transactions)
    return transactionsTypesCreated
  }

  async clearTable (): Promise<number> {
    const transactionsTypesDeleted = await this.transactionTypesModel.destroy({ where: {} })
    return transactionsTypesDeleted
  }
}
