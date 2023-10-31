const TransactionsErrorMessages = {
  INTEGRITY: {
    EXISTING: 'Already exist a transaction with this externalTransactionId'
  },
  NOT_FOUND: {
    BY_EXTERNAL_ID: 'there is no transaction with that external id'
  },
  INVALID: {
    TRANSACTION_TYPE: 'The transaction type is not valid.',
    TRANSACTION_STATUS: 'The transaction status is not valid.',
    VALUE_TYPE: 'The transaction value should be a number.',
    TRANSFER_TYPE: 'The transferType should be a number.',
    TRANSFER_TYPE_RANGE: 'Please provide a valid transactions-transfer type, should be between 1 (CREDIT) - 2 (DEBIT).',
    TRANSFER_TYPE_CREDIT: 'Please provide a valid accountExternalIdCredit identifier.',
    TRANSFER_TYPE_DEBIT: 'Please provide a valid accountExternalIdDebit identifier.'
  },
  MISSING_PROPERTIES: {
    VALUE: 'The transaction value is required.',
    TRANSFER_TYPE: 'The transfer type is required.',
    IDENTIFIER: 'Please provide a valid transaction identifier, accountExternalIdDebit/accountExternalIdCredit is required.'
  }
}
const Configuration = {
  DATABASE: {
    MANAGER_NOT_FOUND: 'No database manager was defined.',
    DATA_SOURCE_NOT_FOUND: 'The database source were not found.'
  }
}
const common = {
  UNKNOWN: 'An unknown error has occurred'
}
const ErrorMessagesConstants = {
  TRANSACTIONS: TransactionsErrorMessages,
  CONFIGURATION: Configuration,
  COMMON: common
}

export default ErrorMessagesConstants
