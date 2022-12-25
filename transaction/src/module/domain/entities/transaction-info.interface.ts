export interface ITransactionType {
  readonly name: string
}

export interface ITransactionStatus {
  readonly name: string
}

export interface ITransactionResponse {
  readonly transactionExternalId: string
  readonly transactionType: ITransactionType
  readonly transactionStatus: ITransactionStatus
  readonly value: number
  readonly createdAt: Date
}
