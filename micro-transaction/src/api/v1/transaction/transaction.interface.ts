export interface RESOURCE_TRANSACTION {
  transactionExternalId: string,
  transactionType: {name: string},
  transactionStatus: {name: string},
  value: number,
  createdAt: Date
}

export interface REQUEST_TRANSACTION {
  accountExternalIdDebit: string,
  accountExternalIdCredit: string,
  tranferTypeId: number,
  value:  number
}

export const REQUEST_TRANSFER_TYPE = {
  DEBIT: 1,
  CREDIT: 2
}