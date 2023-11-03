/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { type IDaoConditionsObject } from '../../interfaces/IDao'
import { type TransactionConditions } from '../../interfaces/ITransactions'

export const conditionsBuilder = (conditions: Partial<TransactionConditions>): IDaoConditionsObject => {
  const baseConditions: IDaoConditionsObject = {}

  if (conditions.transactionExternalId) {
    baseConditions.transactionExternalId = conditions.transactionExternalId
  }

  if (conditions.transactionType) {
    baseConditions.transactionType = conditions.transactionType
  }

  if (conditions.transactionStatus) {
    baseConditions.transactionStatus = conditions.transactionStatus
  }

  if (conditions.value) {
    baseConditions.value = conditions.value
  }

  if (conditions.createdAt) {
    baseConditions.createdAt = conditions.createdAt
  }

  return baseConditions
}
