export class CreateTransactionDto {
    transactionExternalId?: string
    accountExternalIdDebit: string
    accountExternalIdCredit: string
    tranferTypeId: number
    value: number
    transactionType?: string | null
    transactionStatus?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string | null
}
