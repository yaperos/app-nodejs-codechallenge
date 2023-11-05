/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { type IDaoConditionsObject } from '../../interfaces/IDao'
import { type TransactionStatus } from '../../interfaces/ITransactionStatus'

export const conditionsBuilder = (conditions: Partial<TransactionStatus>): IDaoConditionsObject => {
  const baseConditions: IDaoConditionsObject = {}

  if (conditions.name) {
    baseConditions.name = conditions.name
  }

  return baseConditions
}
