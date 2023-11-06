/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { type IDaoConditionsObject } from '../../interfaces/IDao'
import { type TransactionConditions } from '../../interfaces/ITransactions'

export const conditionsBuilder = (conditions: Partial<TransactionConditions>): IDaoConditionsObject => {
  const baseConditions: IDaoConditionsObject = {}

  if (conditions.transaction_id) {
    baseConditions.transaction_id = conditions.transaction_id
  }

  if (conditions.transferTypeId) {
    baseConditions.transferTypeId = conditions.transferTypeId
  }

  if (conditions.transaction_status_id) {
    baseConditions.transaction_status_id = conditions.transaction_status_id
  }

  if (conditions.value) {
    baseConditions.value = conditions.value
  }

  if (conditions.createdAt) {
    baseConditions.createdAt = conditions.createdAt
  }

  return baseConditions
}
