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
  transactionExternalId: string
  transactionType: number
  transactionStatus: string
  value: number
  createdAt: Date
}

export interface TransactionResponse {
  transactionExternalId: string
  transactionType: { name: string }
  transactionStatus: { name: string }
  value: number
  createdAt: Date
  updatedAt: Date
}
