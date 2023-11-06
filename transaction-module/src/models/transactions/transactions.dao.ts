import type Model from 'sequelize/types/model'
import {
  type MessageBrokerTransactionResponse,
  type TransactionConditions,
  type TransactionParams
} from '../../interfaces/ITransactions'
import { type DaoFnUpdate, type DaoFn } from '../../interfaces/IDao'
import transactionModel from '../../database/models/transactions.model'
import transactionTypesModel from '../../database/models/transaction-types.model'
import transactionStatusModel from '../../database/models/transaction-status.model'

import * as transactionsHooks from './transactions.hooks'

export class TransactionsDao {
  private readonly transactionsModel = transactionModel

  getAll: DaoFn<Partial<TransactionConditions>> = async ({ limit = 20, page = 1, ...conditions }, options) => {
    const transactionsConditions = transactionsHooks.conditionsBuilder(conditions)

    const { rows, count } = await transactionModel.findAndCountAll({
      where: transactionsConditions,
      include: [
        {
          model: transactionStatusModel,
          required: false,
          attributes: ['transaction_status_id', 'name']
        },
        {
          model: transactionTypesModel,
          required: false,
          attributes: ['transaction_type_id', 'name']
        }
      ],
      limit: +limit,
      offset: (page - 1) * limit
    })

    return {
      data: rows.map((row: any) => row.toJSON()),
      pagination: {
        count,
        limit: +limit,
        page: +page
      }
    }
  }

  create: DaoFn<TransactionParams> = async (params) => {
    const createdTransaction = await this.transactionsModel.create({ ...params })

    return createdTransaction
  }

  update: DaoFnUpdate<Partial<MessageBrokerTransactionResponse>, Partial<TransactionParams>> = async (
    conditions,
    dataToUpdate
  ) => {
    const updatedTransaction = await this.transactionsModel.update(
      { ...dataToUpdate },
      {
        where: { ...conditions },
        logging: true
      }
    )

    return updatedTransaction
  }

  bulkCreate = async (transactions: any[]): Promise<Array<Model<any, any>>> => {
    const transactionsCreated = await this.transactionsModel.bulkCreate(transactions)
    return transactionsCreated
  }

  async clearTable (): Promise<number> {
    const transactionsDeleted = await this.transactionsModel.destroy({ where: {} })
    return transactionsDeleted
  }
}
