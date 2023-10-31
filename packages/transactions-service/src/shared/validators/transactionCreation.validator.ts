import BadRequestException from '../../app/errors/exceptions/badRequest.exception'
import ErrorMessagesConstants from '../constants/errorMessages.constants'
import type TransactionCreationRequestModel from '../../adapters/in/graphql/models/in/transactionCreationRequest.model'
import { logger } from '../imports'

const transactionErrors = ErrorMessagesConstants.TRANSACTIONS

function validateValue (value: number): void {
  if (typeof value !== 'number') {
    throw new BadRequestException(transactionErrors.INVALID.VALUE_TYPE)
  }
}

function validateTransferType (transferTypeId: number): void {
  if (typeof transferTypeId !== 'number' || transferTypeId <= 0 || transferTypeId > 2) {
    throw new BadRequestException(transactionErrors.INVALID.TRANSFER_TYPE_RANGE)
  }
}

export default function transactionCreationValidation (transaction: TransactionCreationRequestModel): void {
  const { transferTypeId, value, accountExternalIdCredit, accountExternalIdDebit } = transaction

  try {
    if (value === undefined) {
      throw new BadRequestException(transactionErrors.MISSING_PROPERTIES.VALUE)
    }

    if (transferTypeId === undefined) {
      throw new BadRequestException(transactionErrors.MISSING_PROPERTIES.TRANSFER_TYPE)
    }

    validateValue(value)
    validateTransferType(transferTypeId)

    if (accountExternalIdCredit === undefined && accountExternalIdDebit === undefined) {
      throw new BadRequestException(transactionErrors.MISSING_PROPERTIES.IDENTIFIER)
    }

    if (accountExternalIdCredit !== undefined && accountExternalIdDebit !== undefined) {
      throw new BadRequestException(transactionErrors.INVALID.TRANSACTION_TYPE)
    }

    if (transferTypeId === 1 && accountExternalIdCredit === undefined) {
      throw new BadRequestException(transactionErrors.INVALID.TRANSFER_TYPE_CREDIT)
    }

    if (transferTypeId === 2 && accountExternalIdDebit === undefined) {
      throw new BadRequestException(transactionErrors.INVALID.TRANSFER_TYPE_DEBIT)
    }
  } catch (error: any | BadRequestException) {
    logger.logError(error?.description, 'TransactionCreationValidator.ts')
    throw error
  }
}
