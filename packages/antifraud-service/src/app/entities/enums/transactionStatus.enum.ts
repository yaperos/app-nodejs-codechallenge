import ErrorMessagesConstants from '../../../shared/constants/errorMessages.constants'

export enum TransactionStatusEnum {
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  PENDING = 'PENDING'
}
export function getTransactionStatusFromValue (as?: string): TransactionStatusEnum {
  const values = Object.values(TransactionStatusEnum)
  const value = values.find(v => v === as?.toUpperCase())
  if (value === undefined) throw new Error(ErrorMessagesConstants.TRANSACTIONS.INVALID.TRANSACTION_STATUS)
  return value as TransactionStatusEnum
}
