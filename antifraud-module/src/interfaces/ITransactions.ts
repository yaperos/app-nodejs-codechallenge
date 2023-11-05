export interface Transaction {
  transaction_id: string
  accountExternalIdDebit: number
  accountExternalIdCredit: string
  transferTypeId: number
  value: number
  transaction_status_id: number
  createdAt: Date
  updatedAt: Date
}
