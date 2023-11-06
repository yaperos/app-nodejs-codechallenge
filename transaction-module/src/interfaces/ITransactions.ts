export interface Transaction {
  transactionExternalId: string
  transactionType: number
  transactionStatus: string
  value: number
  createdAt: Date
  updatedAt: Date
}

export interface TransactionParams {
  accountExternalIdDebit: string
  accountExternalIdCredit: string
  transferTypeId: number
  value: number
  transaction_status_id: number
}

export interface TransactionConditions {
  transaction_id: string
  transferTypeId: number
  transaction_status_id: string
  value: number
  createdAt: Date
  page: number
  limit: number
}

export interface TransactionResponse {
  transactionExternalId: string
  transactionType: { name: string }
  transactionStatus: { name: string }
  value: number
  createdAt: Date
  updatedAt: Date
}

export interface MessageBrokerTransactionResponse extends TransactionParams {
  transaction_id: string
  status: string
}
