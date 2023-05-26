import { TransactionStatus } from "./transaction-status"
import { TransactionType } from "./transaction-type"

export interface Transaction {
  transactionExternalId: string
  accountExternalIdDebit: string
  accountExternalIdCredit: string
  transactionStatus: TransactionStatus
  transactionType: TransactionType
  value: number
  createdAt: Date
}