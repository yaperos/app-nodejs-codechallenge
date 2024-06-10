import type Model from 'sequelize/types/model'
import { type DaoFn } from '../../interfaces/IDao'
import { type TransactionStatus } from '../../interfaces/ITransactionStatus'
import transactionStatus from '../../database/models/transaction-status.model'

import * as transactionsHooks from './transaction-status.hooks'

export class TransactionStatusDao {
  private readonly transactionStatusModel = transactionStatus

  getAll: DaoFn<Partial<TransactionStatus>> = async (conditions) => {
    const transactionStatusConditions = transactionsHooks.conditionsBuilder(conditions)

    const transactionStatus = await this.transactionStatusModel.findAll({
      where: transactionStatusConditions
    })

    return transactionStatus
  }

  getOne: DaoFn<Partial<TransactionStatus>> = async (conditions) => {
    const transactionStatusConditions = transactionsHooks.conditionsBuilder(conditions)

    const transactionStatus = await this.transactionStatusModel.findOne({
      where: transactionStatusConditions
    })

    return transactionStatus
  }

  create: DaoFn<TransactionStatus> = async (params) => {
    const createdTransactionStatus = await this.transactionStatusModel.create({ ...params })

    return createdTransactionStatus
  }

  bulkCreate = async (transactions: any[]): Promise<Array<Model<any, any>>> => {
    const transactionsStatusCreated = await this.transactionStatusModel.bulkCreate(transactions)
    return transactionsStatusCreated
  }

  async clearTable (): Promise<number> {
    const transactionsStatusDeleted = await this.transactionStatusModel.destroy({ where: {} })
    return transactionsStatusDeleted
  }
}
