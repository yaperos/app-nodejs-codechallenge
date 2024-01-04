export enum TxnStatus {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected"
}

export interface ITransaction {
  transactionExternalId: string,
  transactionStatus: TxnStatus,
  transactionTypeId: number,
  value: number,
  createdAt: string,
  updatedAt: string
}

export interface ITxnInput {
  accountExternalIdDebit: string
  accountExternalIdCredit: string
  transactionTypeId: number
  value: number
}