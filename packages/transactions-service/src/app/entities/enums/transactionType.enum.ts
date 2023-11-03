import ErrorMessages from '../../../shared/constants/errorMessages.constants'
import BadRequestException from '../../errors/exceptions/badRequest.exception'

export enum TransactionTypeEnum {
  CREDIT = 'CREDIT',
  DEBIT = 'DEBIT'
}

export function getTransactionTypeEnumFromValue (value?: string): TransactionTypeEnum {
  const parsedValue = value?.toUpperCase()
  if (parsedValue === 'CREDIT' || parsedValue === 'DEBIT') {
    return parsedValue as unknown as TransactionTypeEnum
  }
  throw new BadRequestException(ErrorMessages.TRANSACTIONS.INVALID.TRANSACTION_TYPE)
}
