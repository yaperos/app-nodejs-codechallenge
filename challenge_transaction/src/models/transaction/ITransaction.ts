export interface ITransaction{
    transactionExternalId?:string,
    accountExternalIdDebit?: string,
    accountExternalIdCredit?: string,
    tranferTypeId: number,
    tranferStatusId?: number,
    value:number,
    createdAt?: Date
}

export interface ITransactionResponseKafka{
    transactionExternalId?:string,
    accountExternalIdDebit?: string,
    accountExternalIdCredit?: string,
    tranferTypeId: number,
    value:number,
}

export interface ITransactionFind{
    transactionExternalId:string
}

export interface transactionType{
    name:string,
    id?:number
}
export interface ITransactionResponse{
    transactionExternalId:string,
    transactionType: transactionType,
    transactionStatus: transactionType,
    value: number,
    createdAt: Date
}

export interface AntiFraudResponse{
    transactionExternalId:string,
    transactionStatus: transactionType,
    createdAt: Date
}