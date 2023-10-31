import ErrorMessagesConstants from '../../../shared/constants/errorMessages.constants'
import BadRequestException from '../../errors/exceptions/badRequest.exception'

export enum TransactionStatusEnum {
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  PENDING = 'PENDING'
}
export function getTransactionStatusFromValue (as?: string): TransactionStatusEnum {
  const values = Object.values(TransactionStatusEnum)
  const value = values.find(v => v === as?.toUpperCase())
  if (value === undefined) throw new BadRequestException(ErrorMessagesConstants.TRANSACTIONS.INVALID.TRANSACTION_STATUS)
  return value as TransactionStatusEnum
}
