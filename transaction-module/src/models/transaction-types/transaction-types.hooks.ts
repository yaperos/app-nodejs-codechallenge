/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { type IDaoConditionsObject } from '../../interfaces/IDao'
import { type TransactionTypes } from '../../interfaces/ITransactionTypes'

export const conditionsBuilder = (conditions: Partial<TransactionTypes>): IDaoConditionsObject => {
  const baseConditions: IDaoConditionsObject = {}

  if (conditions.name) {
    baseConditions.name = conditions.name
  }

  return baseConditions
}
