export interface ITransactionStatus {
    id?:number,
    name?: string,
    createdAt?: Date
}

export interface ITransactionStatusFind{
    id:number
}