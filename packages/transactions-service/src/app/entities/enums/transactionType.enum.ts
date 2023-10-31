import ResourceNotFoundException from '../../errors/exceptions/resourceNotFound.exception'
import ErrorMessages from '../../../shared/constants/errorMessages.constants'

export enum TransactionTypeEnum {
  CREDIT = 'CREDIT',
  DEBIT = 'DEBIT'
}

export function getTransactionTypeEnumFromValue (value?: string): TransactionTypeEnum {
  const parsedValue = value?.toUpperCase()
  if (parsedValue === 'CREDIT' || parsedValue === 'DEBIT') {
    return parsedValue as unknown as TransactionTypeEnum
  }
  throw new ResourceNotFoundException(ErrorMessages.TRANSACTIONS.INVALID.TRANSACTION_TYPE)
}
