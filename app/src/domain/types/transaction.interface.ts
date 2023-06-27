export type TransactionType = {
    accountExternalIdDebit:string
    accountExternalIdCredit: string
    tranferTypeId: string
    value: number
    transactionStatus?:{
        name?:string
    }
    createdAt?:Date
}