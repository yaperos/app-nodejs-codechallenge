export interface RetrieveTransactionResponse {
    error?: any
    transaction?: any
}

export interface CreateTransactionResponse {
    error?: any
    transaction?: any
}

export interface SearchTransactionsResponse {
    error?: any
    transactions?: any[]
    pagination?: any
    //hasMore?: boolean
}

export interface DeleteTransactionResponse {
    error?: any
    transaction?: any
}
