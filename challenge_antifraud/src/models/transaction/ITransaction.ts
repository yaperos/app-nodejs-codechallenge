export interface ITransaction{
    transactionExternalId?:string,
    accountExternalIdDebit?: string,
    accountExternalIdCredit?: string,
    tranferTypeId: number,
    tranferStatusId?: number,
    value:number,
    createdAt?: Date
}

export interface ITransactionFind{
    transactionExternalId:string
}

export interface transactionType{
    id:number,
    name:string
}
export interface ITransactionResponse{
    transactionExternalId:string,
    transactionStatus: transactionType,
    createdAt: Date
}